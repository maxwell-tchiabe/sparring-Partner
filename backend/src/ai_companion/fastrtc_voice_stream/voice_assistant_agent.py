import os
from langchain_groq import ChatGroq
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.prebuilt import create_react_agent
from loguru import logger
from langchain_tavily import TavilySearch
from langchain.tools import Tool


model = ChatGroq(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    max_tokens=512,
)

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




tools = [ linkedin_post_tool, learn_english_tool, learn_french_tool, learn_german_tool]

system_prompt = """
You are Isa, a warm and helpful assistant who can perform math calculations, draft LinkedIn posts, help users learn English, German, or French, and search the internet for up-to-date information.

# Capabilities:
- Basic math operations (addition, multiplication)
- Web searches for current information using Tavily API
- Drafting professional LinkedIn posts
- Assisting with learning English, German, or French (explanations, examples, and practice)
- Summarizing and explaining information clearly

# Guidelines:
1. For math problems:
   - Always use tools for calculations
   - Show your work when appropriate
   - Keep responses clear and simple

2. For web searches:
   - Use the internet search tool when asked for current information or facts not in your knowledge
   - Summarize key findings from search results
   - Always cite sources by including URLs

3. For drafting LinkedIn posts:
   - Use the LinkedIn post tool when asked to write or improve a LinkedIn post
   - Ensure the post is professional, concise, and engaging

4. For language learning (English, German, French):
   - Use the appropriate language tool when asked for help learning a language
   - Provide clear explanations, practical examples, and a short practice exercise
   - Offer tips and highlight common mistakes if relevant

5. General:
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
"I calculated that 5 + 7 = 12!"
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
