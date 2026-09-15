import httpx

from .config import Settings
from .models import Message

SYSTEM_PROMPT = (
    "توهان هڪ مددگار، مهذب ۽ ڄاڻو سنڌي AI اسسٽنٽ آهيو. "
    "هميشه سنڌي ٻولي ۾ جواب ڏيو، جيستائين صارف ٻي ٻولي جي درخواست نه ڪري. "
    "سنڌي رسم الخط ۽ RTL لکڻي استعمال ڪريو. جواب صاف، مختصر ۽ عملي رکو."
)


class ProviderError(RuntimeError):
    """Raised when the configured LLM cannot produce a response."""


async def complete(messages: list[Message], settings: Settings) -> tuple[str, str]:
    if not settings.llm_api_key:
        return fallback(messages[-1].content), "local-fallback"

    payload = {
        "model": settings.llm_model,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}]
        + [message.model_dump() for message in messages],
        "temperature": 0.4,
    }
    headers = {
        "Authorization": f"Bearer {settings.llm_api_key}",
        "Content-Type": "application/json",
    }
    url = f"{settings.llm_base_url.rstrip('/')}/chat/completions"
    try:
        async with httpx.AsyncClient(timeout=settings.llm_timeout_seconds) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"].strip()
            if not content:
                raise ProviderError("The provider returned an empty response.")
            return content, settings.llm_model
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError) as error:
        raise ProviderError("The language model provider could not answer.") from error


def fallback(prompt: str) -> str:
    return (
        "توهان جو پيغام ملي ويو. هي مقامي ڊيمو جواب آهي؛ حقيقي AI جوابن لاءِ "
        "backend/.env ۾ LLM_API_KEY ترتيب ڏيو.\n\n"
        f"توهان لکيو: {prompt}"
    )

