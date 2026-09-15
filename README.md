# سنڌي AI چيٽ بوٽ

A polished, accessible Sindhi-language AI chat application with a responsive Next.js frontend and a Python FastAPI backend.

## Architecture

```text
Browser (Next.js, RTL UI)
        │ POST /api/chat
        ▼
FastAPI backend
        │ OpenAI-compatible /chat/completions (optional)
        ▼
Configured LLM provider
```

The frontend keeps the current conversation in memory and sends the full message history for each response. The backend applies a Sindhi-aware system prompt, validates the request, and returns a clear error if the configured provider is unavailable. When no API key is configured, it uses a local fallback response so the app can be previewed without external credentials.

## Requirements

- Node.js 20+
- Python 3.11+
- Optional: an OpenAI-compatible API key

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local  # Windows
# cp .env.example .env.local  # macOS/Linux
npm run dev
```

Open http://localhost:3000. The frontend defaults to `http://localhost:8000`; set `NEXT_PUBLIC_API_URL` when the API is hosted elsewhere.

## Configuration

See `backend/.env.example`. `LLM_BASE_URL` should be the provider root (for example `https://api.openai.com/v1`), `LLM_MODEL` selects the model, and `LLM_API_KEY` enables provider calls. `LLM_TIMEOUT_SECONDS` controls request timeout.

## Validation

```bash
cd backend
pytest

cd ../frontend
npm run lint
npm run build
```

