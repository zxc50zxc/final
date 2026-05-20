from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user, require_roles
from app.database import get_db
from app.models.user import User, UserRole
from app.models.center import HealthCenter
from app.models.medication import MedicationRequest
from app.schemas.medication import MedRequestCreate, MedRequestOut, MedRequestUpdate

router = APIRouter(prefix="/medication-requests", tags=["medications"])


def to_out(req: MedicationRequest) -> MedRequestOut:
    return MedRequestOut(
        id=req.id,
        center_id=req.center_id,
        center_name_ar=req.center.name_ar,
        center_name_en=req.center.name_en,
        medication_name=req.medication_name,
        status=req.status,
        notes=req.notes,
        created_at=req.created_at,
        updated_at=req.updated_at,
    )


@router.post("", response_model=MedRequestOut)
def create_request(
    data: MedRequestCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.pilgrim)),
):
    center = db.query(HealthCenter).filter(HealthCenter.id == data.center_id).first()
    if not center:
        raise HTTPException(status_code=404, detail="Center not found")
    req = MedicationRequest(
        user_id=user.id,
        center_id=data.center_id,
        medication_name=data.medication_name,
        notes=data.notes,
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return to_out(req)


@router.get("/me", response_model=list[MedRequestOut])
def my_requests(db: Session = Depends(get_db), user: User = Depends(require_roles(UserRole.pilgrim))):
    reqs = db.query(MedicationRequest).filter(MedicationRequest.user_id == user.id).order_by(MedicationRequest.created_at.desc()).all()
    return [to_out(r) for r in reqs]


@router.get("/center/{center_id}", response_model=list[MedRequestOut])
def center_requests(
    center_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
):
    if user.role == UserRole.staff and user.center_id != center_id:
        raise HTTPException(status_code=403, detail="Not your center")
    reqs = db.query(MedicationRequest).filter(MedicationRequest.center_id == center_id).order_by(MedicationRequest.created_at.desc()).all()
    return [to_out(r) for r in reqs]


@router.patch("/{request_id}", response_model=MedRequestOut)
def update_request(
    request_id: int,
    data: MedRequestUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
):
    req = db.query(MedicationRequest).filter(MedicationRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if user.role == UserRole.staff and user.center_id != req.center_id:
        raise HTTPException(status_code=403, detail="Not your center")
    req.status = data.status
    req.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(req)
    return to_out(req)
