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

#tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))

def sum_numbers(a: float, b: float) -> float:
    """Sum two numbers together."""
    result = a + b
    logger.info(f"➕ Calculating sum: {a} + {b} = {result}")
    return result


def multiply_numbers(a: float, b: float) -> float:
    """Multiply two numbers together."""
    result = a * b
    logger.info(f"✖️ Calculating product: {a} × {b} = {result}")
    return result

# Create the Tavily search tool
search_tool = TavilySearch(max_results=3)

def draft_linkedin_post(input_text: str) -> str:
    prompt = (
        "You are an assistant that drafts professional LinkedIn posts. "
        "Given the following topic or bullet points, write a concise and engaging LinkedIn post draft:\n\n"
        f"{input_text}\n\n"
        "Draft:"
    )
    logger.info(f"📝 Drafting LinkedIn post for input: {input_text}")

    response = model.invoke(prompt)
    logger.info(f"✍️ LinkedIn post draft response: {response}")

    # Ensure the response is a string and strip any extra whitespace
    if isinstance(response, str):
        return response.strip() # Ensure we return a clean string

linkedin_post_tool = Tool(
    name="draft_linkedin_post",
    description="Drafts a LinkedIn post from a topic or bullet points.",
    func=draft_linkedin_post
)




tools = [search_tool, linkedin_post_tool, sum_numbers, multiply_numbers]

system_prompt = """You are Isa, a warm and helpful assistant who can perform math calculations and internet searches.

#Capabilities:
- Basic math operations (addition, multiplication)
- Web searches for up-to-date information using Tavily API

#Guidelines:
1. For math problems:
   - Always use tools for calculations
   - Show your work when appropriate
   - Keep responses clear and simple

2. For web searches:
   - Use when asked for current information or facts not in your knowledge
   - Summarize key findings from search results
   - Always cite sources by including URLs

3. General:
   - Maintain a friendly, conversational tone
   - Avoid special characters/symbols (output may be converted to audio)
   - Be concise but thorough
   - If unsure, ask clarifying questions

Example responses:
 "I calculated that 5 + 7 = 12!"
 "I found some information about [topic]. Here's a summary... (Source: example.com)"
 "I'm happy to help! Could you clarify what you mean by...?"""""

memory = InMemorySaver()

agent = create_react_agent(
    model=model,
    tools=tools,
    prompt=system_prompt,
    checkpointer=memory,
)

agent_config = {"configurable": {"thread_id": "default_user"}, "recursion_limit": 100 }
