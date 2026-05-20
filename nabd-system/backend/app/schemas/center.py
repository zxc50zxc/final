from pydantic import BaseModel


class CenterOut(BaseModel):
    id: int
    name_ar: str
    name_en: str
    zone_ar: str
    zone_en: str
    lat: float
    lng: float
    capacity: int
    current_queue: int
    avg_wait_min: int
    occupancy_pct: float
    crowd_level: str

    model_config = {"from_attributes": True}


class CenterUpdate(BaseModel):
    current_queue: int | None = None
    avg_wait_min: int | None = None
    capacity: int | None = None


class RecommendOut(BaseModel):
    recommended: CenterOut
    alternatives: list[CenterOut]
    zone: str
    score: float
