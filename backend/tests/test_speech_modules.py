import asyncio
import unittest
from types import SimpleNamespace
from unittest.mock import Mock

from ai_companion.core.exceptions import SpeechToTextError, TextToSpeechError
from ai_companion.modules.speech.speech_to_text import SpeechToText
from ai_companion.modules.speech.text_to_speech import TextToSpeech


class TextToSpeechTests(unittest.TestCase):
    def setUp(self):
        self.service = object.__new__(TextToSpeech)
        self.service._client = SimpleNamespace(
            text_to_speech=SimpleNamespace(
                convert=Mock(return_value=[b"audio-", b"data"])
            )
        )

    def test_synthesize_returns_combined_audio_chunks(self):
        result = asyncio.run(self.service.synthesize("hello"))

        self.assertEqual(result, b"audio-data")
        self.service._client.text_to_speech.convert.assert_called_once()

    def test_synthesize_rejects_empty_text(self):
        with self.assertRaises(ValueError):
            asyncio.run(self.service.synthesize("   "))

    def test_synthesize_wraps_client_errors(self):
        self.service._client.text_to_speech.convert.side_effect = RuntimeError("offline")

        with self.assertRaises(TextToSpeechError):
            asyncio.run(self.service.synthesize("hello"))


class SpeechToTextTests(unittest.TestCase):
    def setUp(self):
        self.transcription = Mock(return_value="hello world")
        self.service = object.__new__(SpeechToText)
        self.service._client = SimpleNamespace(
            audio=SimpleNamespace(
                transcriptions=SimpleNamespace(create=self.transcription)
            )
        )

    def test_transcribe_returns_client_transcription(self):
        result = asyncio.run(self.service.transcribe(b"wav-data"))

        self.assertEqual(result, "hello world")
        self.transcription.assert_called_once()
        self.assertEqual(self.transcription.call_args.kwargs["model"], "whisper-large-v3-turbo")

    def test_transcribe_rejects_empty_audio(self):
        with self.assertRaises(ValueError):
            asyncio.run(self.service.transcribe(b""))

    def test_transcribe_wraps_client_errors(self):
        self.transcription.side_effect = RuntimeError("offline")

        with self.assertRaises(SpeechToTextError):
            asyncio.run(self.service.transcribe(b"wav-data"))


if __name__ == "__main__":
    unittest.main()
