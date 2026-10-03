import os
import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

os.environ.setdefault("SUPABASE_URL", "http://localhost:54321")
os.environ.setdefault("SUPABASE_JWT_SECRET", "test-jwt-secret")
os.environ.setdefault(
    "SUPABASE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QifQ.c2lnbmF0dXJl",
)
os.environ.setdefault("GROQ_API_KEY", "test-groq-key")
os.environ.setdefault("ELEVENLABS_API_KEY", "test-elevenlabs-key")
os.environ.setdefault("ELEVENLABS_VOICE_ID", "test-voice-id")
os.environ.setdefault("TOGETHER_API_KEY", "test-together-key")
os.environ.setdefault("QDRANT_URL", "http://localhost:6333")
os.environ.setdefault("QDRANT_API_KEY", "test-qdrant-key")

from fastapi.testclient import TestClient

from ai_companion.interfaces.api.main import app
from ai_companion.models.chat_session import ChatSession
from ai_companion.models.message import Message, MessageContent


class ApiIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.database = SimpleNamespace(
            create_chat_session=AsyncMock(),
            get_chat_sessions=AsyncMock(),
            get_chat_session=AsyncMock(),
            update_chat_session=AsyncMock(),
        )
        self.database_patch = patch(
            "ai_companion.interfaces.api.routes.db", self.database
        )
        self.database_patch.start()
        self.token_patch = patch(
            "ai_companion.interfaces.api.main.verify_token",
            return_value="user-1",
        )
        self.token_patch.start()
        self.client = TestClient(app)

    def tearDown(self):
        self.token_patch.stop()
        self.database_patch.stop()

    def _headers(self):
        return {"Authorization": "Bearer test-token"}

    def _session(self, user_id="user-1"):
        return ChatSession(id="session-1", title="Existing session", user_id=user_id)

    def test_health_endpoint_returns_ok(self):
        response = self.client.get("/api/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_create_chat_session_uses_authenticated_user(self):
        self.database.create_chat_session.return_value = self._session()

        response = self.client.post("/api/chat-sessions", headers=self._headers())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user_id"], "user-1")
        self.database.create_chat_session.assert_awaited_once()
        created_session = self.database.create_chat_session.await_args.args[0]
        self.assertEqual(created_session.user_id, "user-1")

    def test_list_chat_sessions_returns_database_results(self):
        self.database.get_chat_sessions.return_value = [self._session()]

        response = self.client.get("/api/chat-sessions", headers=self._headers())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["id"], "session-1")
        self.database.get_chat_sessions.assert_awaited_once_with("user-1")

    def test_update_owned_chat_session_succeeds(self):
        self.database.get_chat_session.return_value = self._session()
        self.database.update_chat_session.return_value = True

        response = self.client.patch(
            "/api/chat-sessions/session-1",
            headers=self._headers(),
            json={"title": "Updated title"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")
        self.database.update_chat_session.assert_awaited_once_with(
            "session-1", {"title": "Updated title"}
        )

    def test_update_foreign_chat_session_is_forbidden(self):
        self.database.get_chat_session.return_value = self._session(user_id="user-2")

        response = self.client.patch(
            "/api/chat-sessions/session-1",
            headers=self._headers(),
            json={"title": "Should not update"},
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["detail"], "Not authorized to update this chat session")
        self.database.update_chat_session.assert_not_awaited()

    def test_chat_text_message_returns_assistant_response(self):
        self.database.get_chat_session.return_value = self._session()
        stored_user_message = Message(
            session_id="session-1",
            sender="user",
            content=MessageContent(type="conversation", text="Hello"),
        )
        stored_assistant_message = Message(
            session_id="session-1",
            sender="assistant",
            content=MessageContent(type="conversation", text="Hello back"),
        )
        self.database.save_message = AsyncMock(
            side_effect=[stored_user_message, stored_assistant_message]
        )

        graph = MagicMock()
        graph.ainvoke = AsyncMock()
        graph.aget_state = AsyncMock(
            return_value=SimpleNamespace(
                values={
                    "workflow": "conversation",
                    "messages": [SimpleNamespace(content="Hello back")],
                }
            )
        )
        checkpoint = _AsyncCheckpoint()
        graph_builder = MagicMock()
        graph_builder.compile.return_value = graph

        with (
            patch("ai_companion.interfaces.api.routes.graph_builder", graph_builder),
            patch(
                "ai_companion.interfaces.api.routes.AsyncSqliteSaver.from_conn_string",
                return_value=checkpoint,
            ),
            patch(
                "ai_companion.interfaces.api.routes.DashboardService.process_message_for_dashboard",
                new=AsyncMock(),
            ),
        ):
            response = self.client.post(
                "/api/chat",
                headers=self._headers(),
                data={"session_id": "session-1", "message": "Hello"},
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["sender"], "assistant")
        self.assertEqual(response.json()["content"]["text"], "Hello back")
        graph.ainvoke.assert_awaited_once()
        self.assertEqual(self.database.save_message.await_count, 2)

    def test_chat_without_input_returns_bad_request(self):
        self.database.get_chat_session.return_value = self._session()

        response = self.client.post(
            "/api/chat",
            headers=self._headers(),
            data={"session_id": "session-1"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "No valid input provided")


class _AsyncCheckpoint:
    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        return False


if __name__ == "__main__":
    unittest.main()
