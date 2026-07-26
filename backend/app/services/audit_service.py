import time
import httpx
from bs4 import BeautifulSoup
from fastapi import HTTPException
from pydantic import HttpUrl


class AuditService:
    @staticmethod
    async def perform_audit(url: HttpUrl) -> dict:
        url_str = str(url)
        start_time = time.perf_counter()

        try:
            # Fetch the webpage with a 10-second timeout
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url_str, follow_redirects=True)
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=504,
                detail="The website took too long to respond."
            )
        except httpx.RequestError:
            raise HTTPException(
                status_code=502,
                detail="Could not connect to the requested website."
            )

        # Calculate response time
        end_time = time.perf_counter()
        response_time_ms = round((end_time - start_time) * 1000, 2)

        # Verify HTML response
        content_type = response.headers.get("content-type", "")
        if "text/html" not in content_type.lower():
            raise HTTPException(
                status_code=415,
                detail="The URL does not point to an HTML page."
            )

        # Parse HTML using BeautifulSoup
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract SEO elements
        title = soup.title.get_text(strip=True) if soup.title else None

        meta_description_tag = soup.find("meta", attrs={"name": "description"})
        meta_description = (
            meta_description_tag.get("content")
            if meta_description_tag
            else None
        )

        h1_count = len(soup.find_all("h1"))

        images = soup.find_all("img")
        images_missing_alt_count = len(
            [img for img in images if not img.get("alt")]
        )

        # Clean non-visible tags to estimate word count
        for element in soup(["script", "style", "noscript"]):
            element.decompose()

        text = soup.get_text(separator=" ", strip=True)
        word_count = len(text.split())

        return {
            "url": url_str,
            "http_status": response.status_code,
            "response_time_ms": response_time_ms,
            "title": title,
            "meta_description": meta_description,
            "h1_count": h1_count,
            "images_missing_alt": images_missing_alt_count,
            "word_count": word_count,
        }
