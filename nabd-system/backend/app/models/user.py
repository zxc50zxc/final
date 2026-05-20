import enum
from datetime import datetime

from sqlalchemy import String, DateTime, Enum, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class UserRole(str, enum.Enum):
    pilgrim = "pilgrim"
    staff = "staff"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.pilgrim)
    preferred_lang: Mapped[str] = mapped_column(String(5), default="ar")
    center_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("health_centers.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    center = relationship("HealthCenter", back_populates="staff_members")
    appointments = relationship("Appointment", back_populates="user")
    medication_requests = relationship("MedicationRequest", back_populates="user")
