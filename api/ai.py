from http.server import BaseHTTPRequestHandler
import os
import json
from groq import Groq

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        user_message = data.get('message', '')
        api_key = os.environ.get("GROQ_API_KEY")
        
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
                response_text = f"System Error: {str(e)}"
        else:
             response_text = "⚠️ SYSTEM ALERT: GROQ_API_KEY missing in Vercel Environment Variables."

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"response": response_text}).encode('utf-8'))
        return
