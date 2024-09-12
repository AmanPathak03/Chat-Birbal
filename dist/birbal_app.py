import streamlit as st
from google.cloud import aiplatform

# Initialize constants
MODEL_NAME = "gemini-1.5-flash"
API_KEY = st.secrets["GOOGLE_API_KEY"]

# Initialize AI Platform
aiplatform.init(
    project='your-project-id',  # Replace with your Google Cloud project ID
    location='us-central1'  # Replace with your desired region
)

# Define avatars
avatars = [
    {
        "name": "Birbal",
        "prompt": "Your name is Birbal, You are made and developed by Developer Aman Pathak, You are very smart enough to answer every question asked to you, be polite and friendly."
    }
]

def run_chat(prompt, history=None, selected_avatar=None):
    if history is None:
        history = []
    if selected_avatar is None:
        selected_avatar = avatars[0]
    
    try:
        internal_prompt = (f"Based on the user's question: \"{prompt}\", respond in a conversational, friendly manner. "
                           "Be concise, use emojis where appropriate, and try to keep the tone light and helpful.")
        
        # Initialize model
        model = aiplatform.Model(MODEL_NAME)
        
        # Define generation config
        generation_config = {
            "temperature": 0.9,
            "topK": 1,
            "topP": 1,
            "maxOutputTokens": 2000
        }

        # Define user message
        user_message = {
            "role": "user",
            "parts": [{"text": prompt}]
        }

        chat_history = history + [user_message]

        # Generate response
        chat = model.chat(
            prompt=internal_prompt,
            history=chat_history,
            temperature=generation_config["temperature"],
            top_k=generation_config["topK"],
            top_p=generation_config["topP"],
            max_output_tokens=generation_config["maxOutputTokens"]
        )

        response = chat.response

        return response.text
    except Exception as e:
        st.error(f"Error in run_chat: {e}")
        raise RuntimeError("Failed to generate response from the AI model.")
