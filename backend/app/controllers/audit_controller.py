from fastapi import APIRouter
from pydantic import BaseModel, HttpUrl

from app.services.audit_service import AuditService

router = APIRouter()


class AuditRequest(BaseModel):
    url: HttpUrl


class AuditResponse(BaseModel):
    url: str
    http_status: int
    response_time_ms: float
    title: str | None
    meta_description: str | None
    h1_count: int
    images_missing_alt: int
    word_count: int


@router.post("/audit", response_model=AuditResponse)
async def audit_url(request: AuditRequest):
    result = await AuditService.perform_audit(request.url)
    return result
