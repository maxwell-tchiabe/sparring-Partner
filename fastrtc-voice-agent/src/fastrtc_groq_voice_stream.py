import argparse
from typing import Generator, Tuple
import fastapi
from fastrtc import (ReplyOnPause, SileroVadOptions, Stream, get_stt_model, get_tts_model, get_twilio_turn_credentials)
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from fastrtc import (
    AlgoOptions,
    ReplyOnPause,
    Stream,
    audio_to_bytes,
)
from groq import Groq
from loguru import logger
from dotenv import load_dotenv

load_dotenv()

from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings
from pydub import AudioSegment
import io

#from process_groq_tts import process_groq_tts
#from simple_math_agent import agent, agent_config

import os
import tempfile
import wave
from typing import Any, Generator, Tuple

import numpy as np
from langchain_groq import ChatGroq
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.prebuilt import create_react_agent
#from loguru import logger
from tavily import TavilyClient
from langchain_tavily import TavilySearch
from langchain.tools import Tool


logger.remove()
logger.add(
    lambda msg: print(msg),
    colorize=True,
    format="<green>{time:HH:mm:ss}</green> | <level>{level}</level> | <level>{message}</level>",
)

def process_groq_tts(
    tts_response: Any,
) -> Generator[Tuple[int, np.ndarray], None, None]:
    """
    Process Groq TTS response into a complete audio segment.

    This function reads the entire audio file and yields it as one piece.

    Args:
        tts_response: Groq TTS API response object

    Yields:
        A single tuple of (sample_rate, audio_array) for audio playback
    """
    temp_file = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    temp_file_path = temp_file.name
    temp_file.close()

    try:
        tts_response.write_to_file(temp_file_path)

        with wave.open(temp_file_path, "rb") as wf:
            sample_rate = wf.getframerate()
            n_frames = wf.getnframes()
            audio_data = wf.readframes(n_frames)

        audio_array = np.frombuffer(audio_data, dtype=np.int16).reshape(1, -1)
        yield (sample_rate, audio_array)
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

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

model = ChatGroq(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    max_tokens=512,
)

tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))

# Create the Tavily search tool
search_tool = TavilySearch(max_results=3)

def draft_linkedin_post(input_text: str) -> str:
    prompt = (
        "You are an assistant that drafts professional LinkedIn posts. "
        "Given the following topic or bullet points, write a concise and engaging LinkedIn post draft:\n\n"
        f"{input_text}\n\n"
        "Draft:"
    )
    logger.debug(f"📝 Drafting LinkedIn post for input: {input_text}")

    response = model.invoke(prompt)
    logger.debug(f"✍️ LinkedIn post draft response: {response}")

    # Ensure the response is a string and strip any extra whitespace
    if isinstance(response, str):
        return response.strip() # Ensure we return a clean string

def learn_english(input_text: str) -> str:
    prompt = (
        "You are an expert English language tutor. "
        "Your role is to help users improve their English skills, regardless of their current level. "
        "Given the following topic, phrase, or question, please:\n"
        "- Explain the concept clearly and simply\n"
        "- Provide at least two practical examples\n"
        "- Offer a short exercise or question for practice in plain text\n"
        "- Do not use colons, asterisks, dashes, or bullet points in your response\n" 
        "- Do not use any special characters or symbols \n"
        "- If relevant, point out common mistakes and tips to avoid them\n\n"
        
        f"User input: {input_text}\n\n"
        "Your response should be easy to read and listen to"
    )
    
    response = model.invoke(prompt)
    logger.debug(f"✍️ english response: {response}")

    # Ensure the response is a string and strip any extra whitespace
    if isinstance(response, str):
        return response.strip() # Ensure we return a clean string

def learn_german(input_text: str) -> str:
    prompt = (
        "You are a professional German language teacher. "
        "Help the user learn German, regardless of their current level. "
        "For the following topic, phrase, or question:\n"
        "- Give a clear explanation in simple terms\n"
        "- Provide at least two practical examples (with translations)\n"
        "- Suggest a short exercise or question for practice\n"
        "- Do not use colons, asterisks, dashes, or bullet points in your response\n" 
        "- Do not use any special characters or symbols \n"
        "- Mention any common mistakes and tips\n\n"
        f"User input: {input_text}\n\n"
        "Your response should be easy to read and listen to"
    )

    response = model.invoke(prompt)
    logger.debug(f"✍️ German response: {response}")

    # Ensure the response is a string and strip any extra whitespace
    if isinstance(response, str):
        return response.strip() # Ensure we return a clean string

def learn_french(input_text: str) -> str:
    prompt = (
        "You are a skilled French language tutor. "
        "Assist the user in learning French, no matter their proficiency. "
        "For the following topic, phrase, or question:\n"
        "- Provide a clear and concise explanation\n"
        "- Offer at least two practical examples (with English translations)\n"
        "- Create a short exercise or question for practice\n"
        "- Do not use colons, asterisks, dashes, or bullet points in your response\n" 
        "- Do not use any special characters or symbols \n"
        "- Highlight common pitfalls and useful tips\n\n"
        f"User input: {input_text}\n\n"
        "Your response should be easy to read and listen to"
    )
    logger.debug(f"📝 Drafting French response for input: {input_text}")

    response = model.invoke(prompt)
    logger.debug(f"✍️ French response: {response}")
    # Ensure the response is a string and strip any extra whitespace
    if isinstance(response, str):
        return response.strip() # Ensure we return a clean string

learn_english_tool = Tool(
    name="learn_english",
    description="Helps users learn English by providing explanations, examples, and exercises.",
    func=learn_english
)

learn_german_tool = Tool(
    name="learn_german",
    description="Helps users learn German by providing explanations, examples, and exercises.",
    func=learn_german
)

learn_french_tool = Tool(
    name="learn_french",
    description="Helps users learn French by providing explanations, examples, and exercises.",
    func=learn_french
)

linkedin_post_tool = Tool(
    name="draft_linkedin_post",
    description="Drafts a LinkedIn post from a topic or bullet points.",
    func=draft_linkedin_post
)




tools = [search_tool, linkedin_post_tool, learn_english_tool, learn_french_tool, learn_german_tool]

system_prompt = """
You are Isa, a warm and helpful assistant who can draft LinkedIn posts, help users learn English, German, or French, and search the internet for up-to-date information.

# Capabilities:
- Web searches for current information using Tavily API
- Drafting professional LinkedIn posts
- Assisting with learning English, German, or French (explanations, examples, and practice)
- Summarizing and explaining information clearly

# Guidelines:

1. For web searches:
   - Use the internet search tool when asked for current information or facts not in your knowledge
   - Summarize key findings from search results
   - Always cite sources by including URLs
   - Avoid using colons, asterisks, dashes, or bullet points in your response
   - Do not use any special characters or symbols (output may be converted to audio)

2. For drafting LinkedIn posts:
   - Use the LinkedIn post tool when asked to write or improve a LinkedIn post
   - Ensure the post is professional, concise, and engaging
   - Avoid using colons, asterisks, dashes, or bullet points in your response
   - Do not use any special characters or symbols (output may be converted to audio)

3. For language learning (English, German, French):
   - Use the appropriate language tool when asked for help learning a language
   - Provide clear explanations, practical examples, and a short practice exercise
   - Offer tips and highlight common mistakes if relevant
   - Avoid using colons, asterisks, dashes, or bullet points in your response
   - Do not use any special characters or symbols (output may be converted to audio)

4. General:
   - Maintain a friendly, conversational tone
   - Avoid special characters or symbols (output may be converted to audio)
   - Be concise but thorough
   - If unsure, ask clarifying questions

    When helping with language learning, you can offer these options
    Say Practice conversation. We can chat about a topic you like and I will help you with vocabulary, grammar, and pronunciation
    Say Improve reading comprehension. I can give you a short text and you can try to summarize it or answer questions about it
    Say Work on grammar. We can focus on a grammar topic like verb tenses or sentence structure
    Say Learn new vocabulary. I can give you a list of words and we can practice using them in sentences
    Say Something else. If you have a different idea or goal, just let me know


# Example responses:
"I found some information about [topic]. Here's a summary... (Source: example.com)"
"Here's a professional LinkedIn post draft for your topic..."
"Let's practice some German! The phrase 'Guten Morgen' means 'Good morning.' Try using it in a sentence!"
"I'm happy to help! Could you clarify what you mean by...?"
"""


memory = InMemorySaver()

agent = create_react_agent(
    model=model,
    tools=tools,
    prompt=system_prompt,
    checkpointer=memory,
)

agent_config = {"configurable": {"thread_id": "default_user"}, "recursion_limit": 100 }




groq_client = Groq()

elevenlabs_client = ElevenLabs(api_key=os.environ.get("ELEVENLABS_API_KEY"))

stt_model = get_stt_model()
tts_model = get_tts_model()

def echo(audio: tuple[int, np.ndarray]):
    prompt = stt_model.stt(audio)

    logger.debug("🧠 Running agent...")
    agent_response = agent.invoke(
        {"messages": [{"role": "user", "content": prompt}]}, config=agent_config
    )
    response_text = agent_response["messages"][-1].content

    """ response = groq_client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[{"role": "user", "content": response_text}],
        max_tokens=512,
    )
    prompt = response.choices[0].message.content """
    for audio_chunk in tts_model.stream_tts_sync(response_text):
        logger.debug("🔊 Generating speech...")
        yield audio_chunk

def response(
    audio: tuple[int, np.ndarray],
) -> Generator[Tuple[int, np.ndarray], None, None]:
    """
    Process audio input, transcribe it, generate a response using LangGraph, and deliver TTS audio.

    Args:
        audio: Tuple containing sample rate and audio data

    Yields:
        Tuples of (sample_rate, audio_array) for audio playback
    """
    logger.info("🎙️ Received audio input")

    logger.debug("🔄 Transcribing audio...")
    transcript = groq_client.audio.transcriptions.create(
        file=("audio-file.mp3", audio_to_bytes(audio)),
        model="whisper-large-v3-turbo",
        response_format="text",
    )
    logger.info(f'👂 Transcribed: "{transcript}"')

    logger.debug("🧠 Running agent...")
    agent_response = agent.invoke(
        {"messages": [{"role": "user", "content": transcript}]}, config=agent_config
    )
    response_text = agent_response["messages"][-1].content
    logger.info(f'💬 Response: "{response_text}"')

    logger.debug("🔊 Generating speech...")
    """ tts_response = groq_client.audio.speech.create(
        model="playai-tts",
        voice="Celeste-PlayAI",
        response_format="wav",
        input=response_text,
    ) """
    try:
        logger.debug("🔊 Generating speech...")
        tts_stream = elevenlabs_client.text_to_speech.convert(
            voice_id=os.environ.get("ELEVENLABS_VOICE_ID"),
            model_id="eleven_turbo_v2",
            text=response_text,
            voice_settings=VoiceSettings(
                stability=0.5,
                similarity_boost=0.5,
                style=0.0,
                speaker_boost=True
            )
        )
        
        yield from process_elevenlabs_tts(tts_stream)
    except Exception as e:
        logger.error(f"Error generating speech: {e}")
        raise


def create_stream() -> Stream:
    """
    Create and configure a Stream instance with audio capabilities.

    Returns:
        Stream: Configured FastRTC Stream instance
    """
    """ return Stream(
        modality="audio",
        mode="send-receive",
        handler=ReplyOnPause(
            response,               
            algo_options=AlgoOptions(
            speech_threshold=0.5,
            ),
        ),
    ) """

    return Stream(
        modality="audio",
        mode="send-receive",
        handler=ReplyOnPause(
            response,
            algo_options=AlgoOptions(
                audio_chunk_duration=0.5,
                started_talking_threshold=0.1,
                speech_threshold=0.03
            ),
            model_options=SileroVadOptions(
                threshold=0.75,
                min_speech_duration_ms=250,
                min_silence_duration_ms=1500,
                speech_pad_ms=400,
                max_speech_duration_s=15
            ),
        ),
    )

stream = create_stream()

app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stream.mount(app)



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FastRTC Groq Voice Agent")
    parser.add_argument(
        "--phone",
        action="store_true",
        help="Launch with FastRTC phone interface (get a temp phone number)",
    )
    args = parser.parse_args()

    stream = create_stream()
    logger.info("🎧 Stream handler configured")

    if args.phone:
        logger.info("🌈 Launching with FastRTC phone interface...")
        stream.fastphone()
    else:
        logger.info("🌈 Launching with Gradio UI...")
        stream.ui.launch()
