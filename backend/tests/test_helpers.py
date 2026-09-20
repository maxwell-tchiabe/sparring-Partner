import unittest

from ai_companion.core.helpers import clean_env_var


class CleanEnvVarTests(unittest.TestCase):
    def test_removes_non_printable_characters_and_control_whitespace(self):
        value = "  api\tkey\r\n\x00"

        self.assertEqual(clean_env_var(value), "  apikey")

    def test_preserves_printable_characters_and_spaces(self):
        value = " api key / value "

        self.assertEqual(clean_env_var(value), value)


if __name__ == "__main__":
    unittest.main()
