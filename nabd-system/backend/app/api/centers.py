from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user, require_roles
from app.database import get_db
from app.models.user import User, UserRole
from app.models.center import HealthCenter
from app.schemas.center import CenterOut, CenterUpdate, RecommendOut
from app.services.routing import recommend_center, center_to_dict

router = APIRouter(prefix="/centers", tags=["centers"])

ZONES = [
    {"id": "mina", "name_ar": "منى", "name_en": "Mina"},
    {"id": "arafat", "name_ar": "عرفات", "name_en": "Arafat"},
    {"id": "muzdalifah", "name_ar": "مزدلفة", "name_en": "Muzdalifah"},
    {"id": "makkah_haram", "name_ar": "مكة - محيط الحرم", "name_en": "Makkah - Haram"},
    {"id": "makkah_aziziyah", "name_ar": "مكة - العزيزية", "name_en": "Makkah - Aziziyah"},
]


@router.get("/zones")
def list_zones():
    return ZONES


@router.get("", response_model=list[CenterOut])
def list_centers(db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    centers = db.query(HealthCenter).all()
    return [CenterOut(**center_to_dict(c)) for c in centers]


@router.get("/recommend", response_model=RecommendOut)
def recommend(zone: str = "mina", db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    try:
        rec, alts, score = recommend_center(db, zone)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return RecommendOut(
        recommended=CenterOut(**center_to_dict(rec)),
        alternatives=[CenterOut(**center_to_dict(c)) for c in alts],
        zone=zone,
        score=score,
    )


@router.patch("/{center_id}", response_model=CenterOut)
def update_center(
    center_id: int,
    data: CenterUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
):
    center = db.query(HealthCenter).filter(HealthCenter.id == center_id).first()
    if not center:
        raise HTTPException(status_code=404, detail="Center not found")
    if user.role == UserRole.staff and user.center_id != center_id:
        raise HTTPException(status_code=403, detail="Not your assigned center")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(center, field, value)
    db.commit()
    db.refresh(center)
    return CenterOut(**center_to_dict(center))
