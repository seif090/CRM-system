from typing import Optional
import httpx
from ..core.config import settings


class WhatsAppService:
    def __init__(self):
        self.api_key = settings.WHATSAPP_API_KEY
        self.phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID
        self.business_id = settings.WHATSAPP_BUSINESS_ID
        self.base_url = f"https://graph.facebook.com/v18.0/{self.phone_number_id}" if self.phone_number_id else None

    async def send_message(self, to: str, message: str) -> dict:
        if not self.base_url or not self.api_key:
            return {"status": "error", "message": "WhatsApp not configured"}

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/messages",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "messaging_product": "whatsapp",
                    "to": to,
                    "type": "text",
                    "text": {"body": message},
                },
            )
            return response.json()

    async def send_template(self, to: str, template_name: str, params: Optional[list] = None) -> dict:
        if not self.base_url or not self.api_key:
            return {"status": "error", "message": "WhatsApp not configured"}

        components = []
        if params:
            components.append({
                "type": "body",
                "parameters": [{"type": "text", "text": p} for p in params],
            })

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/messages",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "messaging_product": "whatsapp",
                    "to": to,
                    "type": "template",
                    "template": {
                        "name": template_name,
                        "language": {"code": "ar"},
                        "components": components,
                    },
                },
            )
            return response.json()
