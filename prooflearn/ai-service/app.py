from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
from groq import Groq
from dotenv import load_dotenv

# Load .env file explicitly from the same directory as this script
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "AI Service Online", "provider": "Groq (Llama 3)"})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    # Get Key from Environment
    api_key = os.getenv("GROQ_API_KEY")
    
    response_text = ""

    if api_key:
        try:
            client = Groq(api_key=api_key)
            completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are the AI Assistant for ProofLearn, a Web3 LMS platform where users prove skills to earn Soulbound NFTs. You are helpful, futuristic (cyberpunk style), and concise. Available missions: 'Web3 Intro', 'DeFi Master', 'NFT Creator'. Verification is done by admins. "
                    },
                    {
                        "role": "user",
                        "content": user_message
                    }
                ],
                model="llama-3.3-70b-versatile",
            )
            response_text = completion.choices[0].message.content
        except Exception as e:
            print(f"Groq Error: {e}")
            response_text = f"System Error: {str(e)}"
    else:
         response_text = "⚠️ SYSTEM ALERT: GROQ_API_KEY missing. Please configure your .env file."

    return jsonify({
        "response": response_text,
        "timestamp": time.time()
    })

if __name__ == '__main__':
    print("Starting Groq AI Service on Port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True)
