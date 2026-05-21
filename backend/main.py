import base64
import os
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from graphs.wingman_graph import run_wingman_analysis

app = FastAPI(title="HeartFlow Wingman API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "HeartFlow Wingman"}


@app.post("/analyze")
async def analyze_conversation(
    conversation: Optional[str] = Form(None),
    context: Optional[str] = Form(None),
    screenshots: List[UploadFile] = File(default=[]),
):
    images = []
    for screenshot in screenshots:
        content = await screenshot.read()
        b64 = base64.standard_b64encode(content).decode()
        media_type = screenshot.content_type or "image/jpeg"
        images.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:{media_type};base64,{b64}",
            },
        })

    if not conversation and not images:
        return {"error": "Please provide a conversation transcript or screenshots."}

    result = await run_wingman_analysis(
        conversation=conversation,
        context=context,
        images=images,
    )
    return result
