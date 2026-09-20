import asyncio
import unittest
from datetime import UTC, datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from ai_companion.modules.dashboard.service import DashboardService


class DashboardServiceTests(unittest.TestCase):
    def test_get_stats_calculates_vocab_sessions_grammar_and_activity(self):
        session = SimpleNamespace(id="session-1")
        user_message = SimpleNamespace(
            sender="user",
            content=SimpleNamespace(text="Hello world hello"),
            timestamp=datetime.now(UTC).isoformat(),
        )
        assistant_message = SimpleNamespace(
            sender="assistant",
            content=SimpleNamespace(text="Hi there"),
            timestamp=datetime.now(UTC).isoformat(),
        )

        database = SimpleNamespace(
            get_chat_sessions=AsyncMock(return_value=[session]),
            get_messages=AsyncMock(return_value=[user_message, assistant_message]),
            get_user_learning_errors=AsyncMock(return_value=[{"category": "Grammar"}]),
        )

        with patch("ai_companion.modules.dashboard.service.db", database):
            stats = asyncio.run(DashboardService.get_stats("user-1"))

        self.assertEqual(stats.vocabulary.learned, 2)
        self.assertEqual(stats.conversations.completed, 1)
        self.assertEqual(stats.grammarScore.current, 0)
        self.assertEqual(stats.weeklyProgress.daysActive, 1)

    def test_get_insights_returns_onboarding_insight_without_errors(self):
        database = SimpleNamespace(
            get_user_learning_errors=AsyncMock(return_value=[])
        )

        with patch("ai_companion.modules.dashboard.service.db", database):
            insights = asyncio.run(DashboardService.get_insights("user-1"))

        self.assertEqual(len(insights), 1)
        self.assertEqual(insights[0].type, "improvement")

    def test_get_insights_uses_most_common_error_category(self):
        database = SimpleNamespace(
            get_user_learning_errors=AsyncMock(
                return_value=[
                    {"category": "Grammar"},
                    {"category": "Grammar"},
                    {"category": "Vocabulary"},
                ]
            )
        )

        with patch("ai_companion.modules.dashboard.service.db", database):
            insights = asyncio.run(DashboardService.get_insights("user-1"))

        self.assertEqual(len(insights), 2)
        self.assertIn("Grammar", insights[0].content)


if __name__ == "__main__":
    unittest.main()
