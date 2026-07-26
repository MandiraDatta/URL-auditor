#  URL SEO Auditor

An asynchronous SEO auditing application built for the **Digital Heroes Software Development (SDE) Qualification Task**. It accepts any web page URL, audits its SEO metrics, and renders a clean, responsive report dashboard.

---

##  Features

- **Asynchronous Auditing**: Fast backend fetching using `httpx` async client.
- **SEO Metadata Extraction**:
  - HTTP status validation
  - Server response latency (ms)
  - Page title check
  - Meta description analysis
  - `<h1>` tag count validation
  - Image accessibility check (images missing `alt` text attributes)
  - Text-to-word count extraction
- **Resilient Error Handling**: Sensible messages for connection timeouts, offline domains, invalid URLs, and unsupported media types (e.g. non-HTML pages).
- **Responsive Dashboard UI**: Minimalist, clean design using Tailwind CSS, supporting loader animation states, status badges, and strict viewport formatting.

---

##  Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for Python.
- **BeautifulSoup4**: HTML parsing and SEO element traversal.
- **HTTPX**: Asynchronous HTTP client for requests.
- **Pydantic**: Strict data validation schemas for API inputs/outputs.
- **Pytest**: Automated testing.

### Frontend
- **Next.js (App Router)**: React Framework with TypeScript.
- **Tailwind CSS**: Modern CSS framework for styling.

---

##  Project Structure

```text
seo eng/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Instantiates FastAPI and registers routes
│   │   ├── controllers/
│   │   │   ├── __init__.py
│   │   │   └── audit_controller.py # Defines /audit POST endpoint and schemas
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   └── cors.py          # CORS setup helper
│   │   └── services/
│   │       ├── __init__.py
│   │       └── audit_service.py # URL scraping and parsing logic
│   ├── tests/
│   │   └── test_audit.py        # Pytest test suite (mocked network operations)
│   ├── .gitignore
│   ├── main.py                  # Entry wrapper for uvicorn runner
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── utils/
    │   │   └── api.ts           # Centralized API client wrapper
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx             # Main dashboard UI component
    ├── public/                  # Clean assets folder
    ├── .env.local               # Local environment variables
    ├── .env.example             # Git-tracked environment template
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    └── next.config.ts
```

---

## API Contract

### 1. Healthcheck Endpoint
- **URL**: `/`
- **Method**: `GET`
- **Description**: Returns server running status.
- **Response (200 OK)**:
  ```json
  {
    "message": "URL Auditor API is running!"
  }
  ```

### 2. Audit URL Endpoint
- **URL**: `/audit`
- **Method**: `POST`
- **Description**: Submits a URL to be crawled and analyzed for key SEO parameters.
- **Request Body (JSON)**:
  ```json
  {
    "url": "https://example.com"
  }
  ```
  *(Note: The URL must be a valid schema starting with `http://` or `https://`)*

- **Successful Response (200 OK)**:
  ```json
  {
    "url": "https://example.com/",
    "http_status": 200,
    "response_time_ms": 120.45,
    "title": "Example Domain",
    "meta_description": "A description of the example page content...",
    "h1_count": 1,
    "images_missing_alt": 0,
    "word_count": 125
  }
  ```

- **Error Responses**:
  - **422 Unprocessable Entity** (Invalid or malformed URL payload structure):
    ```json
    {
      "detail": [
        {
          "type": "url_parsing",
          "loc": ["body", "url"],
          "msg": "Input should be a valid URL..."
        }
      ]
    }
    ```
  - **415 Unsupported Media Type** (Target URL resolves to a non-HTML file, e.g. PDF, Image):
    ```json
    {
      "detail": "The URL does not point to an HTML page."
    }
    ```
  - **502 Bad Gateway** (Could not resolve DNS or connect to target host):
    ```json
    {
      "detail": "Could not connect to the requested website."
    }
    ```
  - **504 Gateway Timeout** (Target server took longer than 10 seconds to respond):
    ```json
    {
      "detail": "The website took too long to respond."
    }
    ```

---

## Design Decisions & Reasoning

### 1. Separation of Routing & Business Logic (Modular MVC Pattern)
- **Decision**: Refactored the single monolithic `main.py` file into a modular package structure containing `controllers/` for routing/request validation and `services/` for business logic (scraping/parsing).
- **Reasoning**: Decoupling the route controllers from scraper parsing logic makes the codebase scalable and much easier to maintain. We kept a root-level `main.py` file acting as a proxy/bridge to ensure complete backward compatibility, allowing standard `uvicorn main:app` execution commands to run without modifications.

### 2. Centralized Frontend API Client with Environment Configuration
- **Decision**: Developed a reusable `apiRequest` client inside `frontend/app/utils/api.ts` and extracted the backend endpoint base address to a `.env.local` file (using the standard `NEXT_PUBLIC_` prefix for client-side access).
- **Reasoning**: This prevents hardcoding localhost addresses across multiple files in the client. Component logic is cleaner because request building and error parsing are centralized, and transitioning to a live production environment (e.g. Render/Vercel) is reduced to a simple environment configuration change instead of editing codebase paths.

### 3. Mock-Based Integration Testing
- **Decision**: Implemented an automated test suite under `backend/tests/` using `pytest` and `unittest.mock.AsyncMock` to mock `httpx.AsyncClient.get` network requests.
- **Reasoning**: Live network requests are slow, fragile, require internet access, and target servers might block continuous test executions or change their source HTML over time. Mocking makes our test suite completely deterministic, execution runs in milliseconds, runs offline, and easily forces timeout/connection error codes to directly test exception-handling branches.

---

## 🔧 Getting Started

### 1. Backend Setup

Navigate to the `backend/` directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the development server:

```bash
uvicorn main:app --reload
```


---

### 2. Running Backend Tests

The test suite validates endpoints and parser logic:

```bash
PYTHONPATH=. ./bin/pytest tests/
```

---

### 3. Frontend Setup

Navigate to the `frontend/` directory:

```bash
cd ../frontend
```

Copy the environment variables template and configure it (optional, defaults to localhost):

```bash
cp .env.example .env.local
```

Install packages:

```bash
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

---

## Error & Edge Case Handling

- **Missing URL Scheme**: The frontend automatically prepends `https://` if a plain domain (e.g. `google.com`) is submitted.
- **Server Timeouts**: If a website is extremely slow or unresponsive, the client times out in 10 seconds and returns a `504 Gateway Timeout` with a sensible message instead of freezing.
- **Invalid Domains**: Non-existent URLs return a `502 Bad Gateway` error ("Could not connect to the requested website").
- **Non-HTML Resources**: If a user submits a direct link to an image or PDF, the server validates the `Content-Type` header and rejects the request with a `415 Unsupported Media Type` response.

---

## Verification Requirement

As per the qualifying build ownership requirements, this project includes a visible credit footer link:
- **Text**: `"Built for Digital Heroes Training Task"`
- **Link**: [digitalheroesco.com](https://digitalheroesco.com)
- **Loom vid**:https://www.loom.com/share/2918cbd8a5fe4741ab2db4701c2c2eab
