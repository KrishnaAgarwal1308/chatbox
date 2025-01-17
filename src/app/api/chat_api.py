from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS module
import ollama
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# File to store the conversation history
CONVERSATION_FILE = 'conversation_history.json'

# Load the conversation history from the file if it exists
try:
    with open(CONVERSATION_FILE, 'r') as file:
        conversation_history = json.load(file)
except FileNotFoundError:
    # Initialize a new conversation history if the file doesn't exist
    conversation_history = [
        {
            'role': 'system',
            'content': 'You are an AI chatbot trained to provide human-like responses. You are integrated into the website of the tech fest of IIT Kharagpur (Kshitij). Your job is to assist participants with any queries or problems they face.'
        }
    ]

@app.route('/chat', methods=['POST'])
def chat_with_bot():
    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # Append the user's message to the conversation history
    conversation_history.append({
        'role': 'user',
        'content': user_message
    })
    
    # Pass the conversation history directly
    response = ollama.chat(
        model='hf.co/krishnaagarwal1308/llama-3-8b-Instruct-bnb-4bit-ksitij-team',
        messages=conversation_history
    )
    
    # Append the assistant's response to the conversation history
    assistant_message = response['message']['content']
    conversation_history.append({
        'role': 'assistant',
        'content': assistant_message
    })
    
    # Save the updated conversation history to the file
    with open(CONVERSATION_FILE, 'w') as file:
        json.dump(conversation_history, file, indent=4)
    
    return jsonify({'response': assistant_message})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
