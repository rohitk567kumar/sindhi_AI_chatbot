from fastapi.testclient import TestClient

from app.main import app


def test_health() -> None:
    response = TestClient(app).get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_chat_uses_local_fallback_without_key() -> None:
    response = TestClient(app).post(
        "/api/chat", json={"messages": [{"role": "user", "content": "سلام"}]}
    )
    assert response.status_code == 200
    assert response.json()["message"]["role"] == "assistant"
    assert response.json()["provider"] == "local-fallback"

