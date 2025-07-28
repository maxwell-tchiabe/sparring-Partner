import os
import tempfile
import wave
from typing import Any, Generator, Tuple

import numpy as np
from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings
from pydub import AudioSegment
import io
from loguru import logger


def process_elevenlabs_tts(
    audio_stream: Generator[bytes, None, None]
) -> Generator[Tuple[int, np.ndarray], None, None]:
    """
    Process ElevenLabs TTS stream into audio segments.
    
    Args:
        audio_stream: ElevenLabs TTS audio stream generator
        
    Yields:
        Tuples of (sample_rate, audio_array) for audio playback
    """
    # Combine all audio chunks from the stream
    audio_data = b''.join(audio_stream)
    
    # Create an in-memory file-like object
    audio_buffer = io.BytesIO(audio_data)
    
    try:
        # Read the MP3 data using pydub
        audio = AudioSegment.from_mp3(audio_buffer)
        
        # Convert to numpy array
        samples = np.array(audio.get_array_of_samples())
        if audio.channels > 1:
            samples = samples.reshape((-1, audio.channels))
        
        yield (audio.frame_rate, samples)
        
    except Exception as e:
        logger.error(f"Error processing audio: {e}")
        raise