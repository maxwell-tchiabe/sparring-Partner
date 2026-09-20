import asyncio
import base64
import logging
import unittest
from types import SimpleNamespace
from unittest.mock import Mock

from ai_companion.core.exceptions import ImageToTextError, TextToImageError
from ai_companion.modules.image.image_to_text import ImageToText
from ai_companion.modules.image.text_to_image import TextToImage


class ImageToTextTests(unittest.TestCase):
    def setUp(self):
        self.create_completion = Mock(
            return_value=SimpleNamespace(
                choices=[SimpleNamespace(message=SimpleNamespace(content="a cat"))]
            )
        )
        self.service = object.__new__(ImageToText)
        self.service._client = SimpleNamespace(
            chat=SimpleNamespace(
                completions=SimpleNamespace(create=self.create_completion)
            )
        )
        self.service.logger = logging.getLogger(__name__)

    def test_analyze_image_sends_base64_image_and_returns_description(self):
        result = asyncio.run(self.service.analyze_image(b"image-bytes"))

        self.assertEqual(result, "a cat")
        request = self.create_completion.call_args.kwargs
        image_url = request["messages"][0]["content"][1]["image_url"]["url"]
        self.assertTrue(image_url.endswith(base64.b64encode(b"image-bytes").decode()))
        self.assertIn("describe what you see", request["messages"][0]["content"][0]["text"])

    def test_analyze_image_wraps_empty_image_error(self):
        with self.assertRaises(ImageToTextError):
            asyncio.run(self.service.analyze_image(b""))


class TextToImageTests(unittest.TestCase):
    def setUp(self):
        response = SimpleNamespace(
            data=[SimpleNamespace(b64_json=base64.b64encode(b"image-bytes").decode())]
        )
        self.generate = Mock(return_value=response)
        self.service = object.__new__(TextToImage)
        self.service._together_client = SimpleNamespace(
            images=SimpleNamespace(generate=self.generate)
        )
        self.service.logger = logging.getLogger(__name__)

    def test_generate_image_decodes_generated_image(self):
        result = asyncio.run(self.service.generate_image("a sunset"))

        self.assertEqual(result, b"image-bytes")
        self.generate.assert_called_once()
        self.assertEqual(self.generate.call_args.kwargs["prompt"], "a sunset")

    def test_generate_image_rejects_empty_prompt(self):
        with self.assertRaises(ValueError):
            asyncio.run(self.service.generate_image("  "))

    def test_generate_image_wraps_client_errors(self):
        self.generate.side_effect = RuntimeError("offline")

        with self.assertRaises(TextToImageError):
            asyncio.run(self.service.generate_image("a sunset"))


if __name__ == "__main__":
    unittest.main()
