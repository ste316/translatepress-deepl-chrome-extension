from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import uvicorn
import contextlib
from dotenv import load_dotenv
import os

app = FastAPI()
load_dotenv()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://builditup.it"],
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
)

class TranslationRequest(BaseModel):
    text: str

DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")
DEEPL_API_URL = "https://api-free.deepl.com/v2/translate"

@app.post("/translate")
async def translate(request: TranslationRequest):
    headers = {
        "Authorization": f"DeepL-Auth-Key {DEEPL_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "text": [request.text],
        "target_lang": "IT",
        "source_lang": "EN",
        "context": "Website content for Build It Up, an Italian student-led startup accelerator program. The text is about entrepreneurship, innovation, and student startups. Keep the same text tone and style."
    }
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(DEEPL_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            result = response.json()
            return {"translated_text": result["translations"][0]["text"]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    with contextlib.suppress(ConnectionResetError):
        uvicorn.run(
            app,
            host="localhost",
            port=8443,
            ssl_keyfile="key.pem",
            ssl_certfile="cert.pem",
            log_config={
                "version": 1,
                "disable_existing_loggers": False,
                "handlers": {
                    "default": {
                        "class": "logging.StreamHandler",
                        "formatter": "default",
                        "level": "INFO"
                    }
                },
                "formatters": {
                    "default": {
                        "format": "%(asctime)s - %(levelname)s - %(message)s"
                    }
                },
                "loggers": {
                    "uvicorn": {
                        "handlers": ["default"],
                        "level": "INFO",
                        "propagate": False
                    },
                    "uvicorn.error": {
                        "level": "WARNING"
                    }
                }
            }
        )