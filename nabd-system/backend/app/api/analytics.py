import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import require_roles
from app.database import get_db
from app.models.user import UserRole
from app.services.analytics import build_heatmap_figure, build_peak_hours_figure, build_wait_comparison, get_kpis

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/kpis")
def kpis(db: Session = Depends(get_db), _user=Depends(require_roles(UserRole.admin))):
    return get_kpis(db)


@router.get("/heatmap")
def heatmap(db: Session = Depends(get_db), _user=Depends(require_roles(UserRole.admin))):
    return json.loads(build_heatmap_figure(db))


@router.get("/peak-hours")
def peak_hours(_user=Depends(require_roles(UserRole.admin))):
    return json.loads(build_peak_hours_figure())


@router.get("/wait-comparison")
def wait_comparison(db: Session = Depends(get_db), _user=Depends(require_roles(UserRole.admin))):
    return json.loads(build_wait_comparison(db))
