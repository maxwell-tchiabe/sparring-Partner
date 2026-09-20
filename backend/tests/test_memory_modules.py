import asyncio
import logging
import unittest
from datetime import datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

from ai_companion.modules.memory.long_term.memory_manager import (
    MemoryAnalysis,
    MemoryManager,
)
from ai_companion.modules.memory.long_term.vector_store import Memory, VectorStore


class MemoryTests(unittest.TestCase):
    def test_memory_properties_read_metadata(self):
        timestamp = "2026-01-02T03:04:05"
        memory = Memory(
            text="Likes hiking",
            metadata={"id": "memory-1", "timestamp": timestamp},
            score=0.95,
        )

        self.assertEqual(memory.id, "memory-1")
        self.assertEqual(memory.timestamp, datetime.fromisoformat(timestamp))


class VectorStoreTests(unittest.TestCase):
    def test_search_memories_returns_empty_when_collection_is_missing(self):
        store = object.__new__(VectorStore)
        store._collection_exists = Mock(return_value=False)

        self.assertEqual(store.search_memories("hiking"), [])

    def test_search_memories_maps_qdrant_results_to_memories(self):
        store = object.__new__(VectorStore)
        store._collection_exists = Mock(return_value=True)
        store.model = SimpleNamespace(
            encode=Mock(return_value=SimpleNamespace(tolist=lambda: [0.1, 0.2]))
        )
        store.client = SimpleNamespace(
            search=Mock(
                return_value=[
                    SimpleNamespace(
                        payload={"text": "Likes hiking", "id": "memory-1"},
                        score=0.96,
                    )
                ]
            )
        )

        result = store.search_memories("outdoor activities", k=1)

        self.assertEqual(result[0].text, "Likes hiking")
        self.assertEqual(result[0].id, "memory-1")
        self.assertEqual(result[0].score, 0.96)
        store.client.search.assert_called_once()

    def test_find_similar_memory_applies_similarity_threshold(self):
        store = object.__new__(VectorStore)
        store.search_memories = Mock(
            return_value=[Memory("text", {"id": "1"}, score=0.95)]
        )

        self.assertIsNotNone(store.find_similar_memory("query"))

        store.search_memories.return_value = [Memory("text", {"id": "1"}, score=0.89)]
        self.assertIsNone(store.find_similar_memory("query"))


class MemoryManagerTests(unittest.TestCase):
    def setUp(self):
        self.vector_store = SimpleNamespace(
            find_similar_memory=Mock(return_value=None),
            store_memory=Mock(),
            search_memories=Mock(return_value=[]),
        )
        self.manager = object.__new__(MemoryManager)
        self.manager.vector_store = self.vector_store
        self.manager.logger = logging.getLogger(__name__)

    def test_non_human_messages_are_ignored(self):
        self.manager._analyze_memory = AsyncMock()

        asyncio.run(
            self.manager.extract_and_store_memories(
                SimpleNamespace(type="ai", content="assistant message")
            )
        )

        self.manager._analyze_memory.assert_not_called()
        self.vector_store.store_memory.assert_not_called()

    def test_important_message_is_stored_when_no_similar_memory_exists(self):
        self.manager._analyze_memory = AsyncMock(
            return_value=MemoryAnalysis(
                is_important=True, formatted_memory="Likes hiking"
            )
        )

        asyncio.run(
            self.manager.extract_and_store_memories(
                SimpleNamespace(type="human", content="I really enjoy hiking")
            )
        )

        self.vector_store.store_memory.assert_called_once()
        self.assertEqual(
            self.vector_store.store_memory.call_args.kwargs["text"], "Likes hiking"
        )

    def test_format_memories_for_prompt_returns_bullets(self):
        self.assertEqual(
            self.manager.format_memories_for_prompt(["Likes hiking", "Studies Spanish"]),
            "- Likes hiking\n- Studies Spanish",
        )
        self.assertEqual(self.manager.format_memories_for_prompt([]), "")


if __name__ == "__main__":
    unittest.main()
