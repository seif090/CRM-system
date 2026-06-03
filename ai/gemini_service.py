"""
Standalone AI service for ERP & CRM.
Can be used independently or through the backend.
"""
import os
import json
from typing import Optional

try:
    from google import genai
except ImportError:
    genai = None


class AIService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key and genai:
            self.client = genai.Client(api_key=self.api_key)

    def is_configured(self) -> bool:
        return self.client is not None

    def generate_response(
        self,
        prompt: str,
        system_instruction: str = "You are a helpful business assistant.",
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        if not self.client:
            return "AI not configured. Set GEMINI_API_KEY."

        try:
            chat = self.client.chats.create(
                model="gemini-2.0-flash",
                config={
                    "system_instruction": system_instruction,
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                },
            )
            response = chat.send_message(prompt)
            return response.text
        except Exception as e:
            return f"Error: {str(e)}"

    def generate_sales_reply(
        self,
        customer_name: str,
        message: str,
        context: Optional[dict] = None,
    ) -> str:
        system = f"""You are a professional sales assistant for an ERP & CRM system.
Customer: {customer_name}
Context: {json.dumps(context or {})}

Respond professionally and helpfully. Be concise. Use the customer's language."""

        return self.generate_response(
            prompt=message,
            system_instruction=system,
            temperature=0.7,
        )


if __name__ == "__main__":
    ai = AIService()
    if ai.is_configured():
        print("AI Service Ready")
        while True:
            msg = input("\nEnter message (or 'quit'): ")
            if msg.lower() == "quit":
                break
            response = ai.generate_response(msg)
            print(f"\nAI: {response}")
    else:
        print("Please set GEMINI_API_KEY environment variable")
