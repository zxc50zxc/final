from datetime import datetime

from pydantic import BaseModel

from app.models.medication import MedStatus


class MedRequestCreate(BaseModel):
    center_id: int
    medication_name: str
    notes: str | None = None


class MedRequestUpdate(BaseModel):
    status: MedStatus


class MedRequestOut(BaseModel):
    id: int
    center_id: int
    center_name_ar: str
    center_name_en: str
    medication_name: str
    status: MedStatus
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
