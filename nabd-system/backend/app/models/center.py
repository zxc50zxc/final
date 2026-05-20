from sqlalchemy import String, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class HealthCenter(Base):
    __tablename__ = "health_centers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name_ar: Mapped[str] = mapped_column(String(255))
    name_en: Mapped[str] = mapped_column(String(255))
    zone_ar: Mapped[str] = mapped_column(String(100))
    zone_en: Mapped[str] = mapped_column(String(100))
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    capacity: Mapped[int] = mapped_column(Integer, default=50)
    current_queue: Mapped[int] = mapped_column(Integer, default=0)
    avg_wait_min: Mapped[int] = mapped_column(Integer, default=15)

    staff_members = relationship("User", back_populates="center")
    appointments = relationship("Appointment", back_populates="center")
    medication_requests = relationship("MedicationRequest", back_populates="center")

    @property
    def occupancy_pct(self) -> float:
        if self.capacity <= 0:
            return 100.0
        return min(100.0, (self.current_queue / self.capacity) * 100)

    @property
    def crowd_level(self) -> str:
        pct = self.occupancy_pct
        if pct < 50:
            return "low"
        if pct < 80:
            return "medium"
        return "high"
