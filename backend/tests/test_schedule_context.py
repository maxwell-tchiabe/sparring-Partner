import unittest
from datetime import time

from ai_companion.modules.schedules.context_generation import ScheduleContextGenerator


class ScheduleContextGeneratorTests(unittest.TestCase):
    def test_parse_time_range_returns_start_and_end_times(self):
        start, end = ScheduleContextGenerator._parse_time_range("23:00-06:00")

        self.assertEqual(start, time(23, 0))
        self.assertEqual(end, time(6, 0))

    def test_get_schedule_for_known_day_returns_schedule(self):
        schedule = ScheduleContextGenerator.get_schedule_for_day(0)

        self.assertIn("06:00-07:00", schedule)
        self.assertIn("Morning run", schedule["06:00-07:00"])

    def test_get_schedule_for_unknown_day_returns_empty_schedule(self):
        self.assertEqual(ScheduleContextGenerator.get_schedule_for_day(7), {})


if __name__ == "__main__":
    unittest.main()
