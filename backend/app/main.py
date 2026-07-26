from fastapi import FastAPI

from app.controllers import audit_controller
from app.middleware.cors import setup_cors

app = FastAPI()

# Setup CORS
setup_cors(app)

# Register controllers
app.include_router(audit_controller.router)


@app.get("/")
def home():
    return {"message": "URL Auditor API is running!"}
