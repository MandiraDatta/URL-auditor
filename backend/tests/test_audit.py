from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_home_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "URL Auditor API is running!"}


def test_audit_validation_error():
    # Test with invalid URL structure
    response = client.post("/audit", json={"url": "not-a-url"})
    assert response.status_code == 422


@pytest.mark.asyncio
@patch("httpx.AsyncClient.get")
async def test_audit_success(mock_get):
    # Mock the HTTP response from the target website
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.headers = {"content-type": "text/html; charset=utf-8"}
    mock_response.text = """
    <html>
        <head>
            <title>Test Page Title</title>
            <meta name="description" content="Test Page Description" />
        </head>
        <body>
            <h1>First Header</h1>
            <h1>Second Header</h1>
            <img src="test1.jpg" alt="Valid Alt text" />
            <img src="test2.jpg" />
            <p>Hello world word count</p>
        </body>
    </html>
    """
    mock_get.return_value = mock_response

    # Test the service business logic directly
    from app.services.audit_service import AuditService
    from pydantic import HttpUrl

    result = await AuditService.perform_audit(HttpUrl("https://example.com"))

    assert result["url"] == "https://example.com/"
    assert result["http_status"] == 200
    assert result["title"] == "Test Page Title"
    assert result["meta_description"] == "Test Page Description"
    assert result["h1_count"] == 2
    assert result["images_missing_alt"] == 1
    # Words counted: Test, Page, Title (3) + First, Header, Second, Header (4) + Hello, world, word, count (4) = 11 words
    assert result["word_count"] == 11


@patch("httpx.AsyncClient.get")
def test_audit_timeout_error(mock_get):
    import httpx
    # Simulate a network timeout error
    mock_get.side_effect = httpx.TimeoutException("Request timed out")

    response = client.post("/audit", json={"url": "https://example.com"})
    assert response.status_code == 504
    assert response.json()["detail"] == "The website took too long to respond."


@patch("httpx.AsyncClient.get")
def test_audit_connection_error(mock_get):
    import httpx
    # Simulate a host lookup or connection failure
    mock_get.side_effect = httpx.RequestError("Host lookup failed")

    response = client.post("/audit", json={"url": "https://example.com"})
    assert response.status_code == 502
    assert response.json()["detail"] == "Could not connect to the requested website."


@patch("httpx.AsyncClient.get")
def test_audit_invalid_media_type(mock_get):
    # Simulate receiving a PDF file instead of an HTML page
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.headers = {"content-type": "application/pdf"}
    mock_get.return_value = mock_response

    response = client.post("/audit", json={"url": "https://example.com/report.pdf"})
    assert response.status_code == 415
    assert response.json()["detail"] == "The URL does not point to an HTML page."

