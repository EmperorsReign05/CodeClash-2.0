import os
from omnidimension import Client


# Put your API key here
api_key = "AmnVBZQ-plE4pkTbnh33jvwj7tok5kGS6A26SMJJRmk"

# Initialize the client
client = Client(api_key)

# Agent config
agent_config = {
    "name": "Task Companion Agent",
    "welcome_message": "Hello! I will assist you with your task.",
    "context_breakdown": [
        { "title": "Purpose", "body": "Help the user complete scheduling and calling tasks." }
    ]
}

try:
    # Create the agent
    response = client.agent.create(**agent_config)
    print("Agent created successfully!")
    print(response)
except Exception as e:
    print(f"API Error ({e.status_code}): {e.message}")
except Exception as e:
    print(f"Unexpected error: {str(e)}")
