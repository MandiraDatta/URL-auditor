# Page Pulse - URL SEO Auditor

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
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx             # Main dashboard UI component
    ├── public/                  # Clean assets folder
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    └── next.config.ts
```

---

##  Getting Started

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
*The API will be available at `http://127.0.0.1:8000`.*

---

### 2. Running Backend Tests

The test suite validates endpoints and parser logic while mocking target site HTTP requests:

```bash
pip install pytest pytest-asyncio
pytest
```

---

### 3. Frontend Setup

Navigate to the `frontend/` directory:

```bash
cd ../frontend
```

Install packages:

```bash
npm install
```

Start the Next.js development server:

```bash
npm run dev
```
*The application interface will be available at `http://localhost:3000`.*

---

##  Error & Edge Case Handling

- **Missing URL Scheme**: The frontend automatically prepends `https://` if a plain domain (e.g. `google.com`) is submitted.
- **Server Timeouts**: If a website is extremely slow or unresponsive, the client times out in 10 seconds and returns a `504 Gateway Timeout` with a sensible message instead of freezing.
- **Invalid Domains**: Non-existent URLs return a `502 Bad Gateway` error ("Could not connect to the requested website").
- **Non-HTML Resources**: If a user submits a direct link to an image or PDF, the server validates the `Content-Type` header and rejects the request with a `415 Unsupported Media Type` response.

---

##  Verification Requirement

As per the qualifying build ownership requirements, this project includes a visible credit footer link:
- **Text**: `"Built for Digital Heroes Training Task"`
- **Link**: [digitalheroesco.com](https://digitalheroesco.com)
