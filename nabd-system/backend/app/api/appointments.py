from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user, require_roles
from app.database import get_db
from app.models.user import User, UserRole
from app.models.center import HealthCenter
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentOut

router = APIRouter(prefix="/appointments", tags=["appointments"])


def to_out(appt: Appointment) -> AppointmentOut:
    return AppointmentOut(
        id=appt.id,
        center_id=appt.center_id,
        center_name_ar=appt.center.name_ar,
        center_name_en=appt.center.name_en,
        slot_time=appt.slot_time,
        status=appt.status,
        notes=appt.notes,
    )


@router.post("", response_model=AppointmentOut)
def create_appointment(
    data: AppointmentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.pilgrim)),
):
    center = db.query(HealthCenter).filter(HealthCenter.id == data.center_id).first()
    if not center:
        raise HTTPException(status_code=404, detail="Center not found")
    appt = Appointment(user_id=user.id, center_id=data.center_id, slot_time=data.slot_time, notes=data.notes)
    db.add(appt)
    center.current_queue = min(center.capacity, center.current_queue + 1)
    db.commit()
    db.refresh(appt)
    return to_out(appt)


@router.get("/me", response_model=list[AppointmentOut])
def my_appointments(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    q = db.query(Appointment).filter(Appointment.user_id == user.id)
    return [to_out(a) for a in q.order_by(Appointment.slot_time.desc()).all()]


@router.get("/center/{center_id}", response_model=list[AppointmentOut])
def center_appointments(
    center_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
):
    if user.role == UserRole.staff and user.center_id != center_id:
        raise HTTPException(status_code=403, detail="Not your center")
    appts = db.query(Appointment).filter(Appointment.center_id == center_id).order_by(Appointment.slot_time).all()
    return [to_out(a) for a in appts]
