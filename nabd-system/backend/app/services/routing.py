import math

from sqlalchemy.orm import Session

from app.models.center import HealthCenter

# Zone reference coordinates (holy sites area)
ZONE_COORDS: dict[str, tuple[float, float]] = {
    "mina": (21.4185, 39.8942),
    "arafat": (21.3549, 39.9841),
    "muzdalifah": (21.3850, 39.9310),
    "makkah_haram": (21.4225, 39.8262),
    "makkah_aziziyah": (21.4050, 39.8580),
}


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def center_to_dict(c: HealthCenter) -> dict:
    return {
        "id": c.id,
        "name_ar": c.name_ar,
        "name_en": c.name_en,
        "zone_ar": c.zone_ar,
        "zone_en": c.zone_en,
        "lat": c.lat,
        "lng": c.lng,
        "capacity": c.capacity,
        "current_queue": c.current_queue,
        "avg_wait_min": c.avg_wait_min,
        "occupancy_pct": round(c.occupancy_pct, 1),
        "crowd_level": c.crowd_level,
    }


def recommend_center(db: Session, zone: str) -> tuple[HealthCenter, list[HealthCenter], float]:
    centers = db.query(HealthCenter).all()
    if not centers:
        raise ValueError("No health centers in database")

    ref = ZONE_COORDS.get(zone, ZONE_COORDS["mina"])
    ref_lat, ref_lng = ref

    max_wait = max(c.avg_wait_min for c in centers) or 1
    distances = [haversine_km(ref_lat, ref_lng, c.lat, c.lng) for c in centers]
    max_dist = max(distances) or 1

    scored: list[tuple[float, HealthCenter, float]] = []
    for c, dist in zip(centers, distances):
        norm_wait = c.avg_wait_min / max_wait
        norm_dist = dist / max_dist
        score = 0.6 * norm_wait + 0.4 * norm_dist
        scored.append((score, c, dist))

    scored.sort(key=lambda x: x[0])
    best_score, recommended, _ = scored[0]
    alternatives = [c for _, c, _ in scored[1:4]]
    return recommended, alternatives, round(best_score, 3)
