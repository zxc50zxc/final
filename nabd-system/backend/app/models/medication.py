import enum
from datetime import datetime

from sqlalchemy import String, DateTime, Enum, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MedStatus(str, enum.Enum):
    submitted = "submitted"
    under_review = "under_review"
    ready = "ready"
    dispensed = "dispensed"
    rejected = "rejected"


class MedicationRequest(Base):
    __tablename__ = "medication_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    center_id: Mapped[int] = mapped_column(Integer, ForeignKey("health_centers.id"))
    medication_name: Mapped[str] = mapped_column(String(255))
    status: Mapped[MedStatus] = mapped_column(Enum(MedStatus), default=MedStatus.submitted)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="medication_requests")
    center = relationship("HealthCenter", back_populates="medication_requests")
