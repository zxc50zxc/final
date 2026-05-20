from datetime import datetime

from pydantic import BaseModel

from app.models.appointment import AppointmentStatus


class AppointmentCreate(BaseModel):
    center_id: int
    slot_time: datetime
    notes: str | None = None


class AppointmentOut(BaseModel):
    id: int
    center_id: int
    center_name_ar: str
    center_name_en: str
    slot_time: datetime
    status: AppointmentStatus
    notes: str | None

    model_config = {"from_attributes": True}
