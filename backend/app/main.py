from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .llm import ProviderError, complete
from .models import ChatRequest, ChatResponse, Message

settings = get_settings()
app = FastAPI(title="Sindhi AI Chatbot API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        content, provider = await complete(request.messages, settings)
    except ProviderError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
    return ChatResponse(message=Message(role="assistant", content=content), provider=provider)

