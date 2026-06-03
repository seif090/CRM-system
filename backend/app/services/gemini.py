from typing import List, Dict, Optional
from ..core.config import settings


class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = None
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-2.0-flash")
            except Exception:
                self.model = None

    async def generate_reply(
        self,
        customer_name: str,
        customer_message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        prompt_template: str = "You are a helpful sales assistant.",
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        if not self.model:
            return "AI is not configured. Please set GEMINI_API_KEY in .env"

        system_prompt = f"""{prompt_template}

Customer name: {customer_name}
Current time: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M')}

You are integrated with an ERP & CRM system. You can:
- Answer questions about products, prices, and inventory
- Provide order status and invoice information
- Help with customer inquiries and support
- Schedule appointments and follow-ups
- Provide business insights and reports

Always respond professionally and helpfully in the same language the customer uses.
Keep responses concise and actionable."""

        try:
            history = []
            if conversation_history:
                for msg in conversation_history:
                    role = "user" if msg["role"] == "user" else "model"
                    history.append({"role": role, "parts": [msg["message"]]})

            chat = self.model.start_chat(history=history)
            response = chat.send_message(
                f"{system_prompt}\n\nCustomer message: {customer_message}",
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                },
            )
            return response.text
        except Exception as e:
            return f"I apologize, but I'm having trouble processing your request. Please try again later. (Error: {str(e)})"
