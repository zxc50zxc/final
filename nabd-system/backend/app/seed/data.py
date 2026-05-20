from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.auth import hash_password
from app.models.user import User, UserRole
from app.models.center import HealthCenter
from app.models.appointment import Appointment, AppointmentStatus
from app.models.medication import MedicationRequest, MedStatus

CENTERS = [
    {"name_ar": "مركز منى الصحي 1", "name_en": "Mina Health Center 1", "zone_ar": "منى", "zone_en": "Mina", "lat": 21.4185, "lng": 39.8942, "capacity": 60, "current_queue": 45, "avg_wait_min": 35},
    {"name_ar": "مركز منى الصحي 2", "name_en": "Mina Health Center 2", "zone_ar": "منى", "zone_en": "Mina", "lat": 21.4150, "lng": 39.8980, "capacity": 50, "current_queue": 12, "avg_wait_min": 10},
    {"name_ar": "عيادة عرفات الميدانية", "name_en": "Arafat Field Clinic", "zone_ar": "عرفات", "zone_en": "Arafat", "lat": 21.3549, "lng": 39.9841, "capacity": 80, "current_queue": 70, "avg_wait_min": 50},
    {"name_ar": "مركز مزدلفة الصحي", "name_en": "Muzdalifah Health Center", "zone_ar": "مزدلفة", "zone_en": "Muzdalifah", "lat": 21.3850, "lng": 39.9310, "capacity": 40, "current_queue": 8, "avg_wait_min": 8},
    {"name_ar": "مركز محيط الحرم", "name_en": "Haram Perimeter Clinic", "zone_ar": "مكة - الحرم", "zone_en": "Makkah - Haram", "lat": 21.4225, "lng": 39.8262, "capacity": 100, "current_queue": 85, "avg_wait_min": 55},
    {"name_ar": "مركز العزيزية", "name_en": "Aziziyah Health Center", "zone_ar": "مكة - العزيزية", "zone_en": "Makkah - Aziziyah", "lat": 21.4050, "lng": 39.8580, "capacity": 55, "current_queue": 20, "avg_wait_min": 15},
    {"name_ar": "عيادة مشاعر الشرق", "name_en": "Eastern Mashair Clinic", "zone_ar": "منى", "zone_en": "Mina", "lat": 21.4200, "lng": 39.9050, "capacity": 45, "current_queue": 30, "avg_wait_min": 25},
    {"name_ar": "مركز الطوارئ الميداني", "name_en": "Field Emergency Annex", "zone_ar": "عرفات", "zone_en": "Arafat", "lat": 21.3580, "lng": 39.9780, "capacity": 70, "current_queue": 55, "avg_wait_min": 40},
    {"name_ar": "صيدلية منى المركزية", "name_en": "Mina Central Pharmacy", "zone_ar": "منى", "zone_en": "Mina", "lat": 21.4170, "lng": 39.8920, "capacity": 35, "current_queue": 5, "avg_wait_min": 5},
    {"name_ar": "عيادة جبل الرحمة", "name_en": "Jabal Al-Rahmah Clinic", "zone_ar": "عرفات", "zone_en": "Arafat", "lat": 21.3520, "lng": 39.9880, "capacity": 40, "current_queue": 38, "avg_wait_min": 32},
]


def seed_database(db: Session) -> None:
    if db.query(HealthCenter).first():
        return

    centers = []
    for c in CENTERS:
        center = HealthCenter(**c)
        db.add(center)
        centers.append(center)
    db.flush()

    staff_center = centers[1]
    admin = User(
        email="admin@nabd.sa",
        password_hash=hash_password("admin123"),
        full_name="System Admin",
        role=UserRole.admin,
        preferred_lang="ar",
    )
    staff = User(
        email="staff@nabd.sa",
        password_hash=hash_password("staff123"),
        full_name="Dr. Khalid Al-Otaibi",
        role=UserRole.staff,
        preferred_lang="ar",
        center_id=staff_center.id,
    )
    pilgrim = User(
        email="pilgrim@nabd.sa",
        password_hash=hash_password("pilgrim123"),
        full_name="Ahmed Al-Harbi",
        role=UserRole.pilgrim,
        preferred_lang="ar",
    )
    db.add_all([admin, staff, pilgrim])
    db.flush()

    slot = datetime.utcnow() + timedelta(hours=2)
    db.add(Appointment(
        user_id=pilgrim.id,
        center_id=centers[1].id,
        slot_time=slot,
        status=AppointmentStatus.scheduled,
        notes="Routine checkup",
    ))
    db.add(MedicationRequest(
        user_id=pilgrim.id,
        center_id=centers[8].id,
        medication_name="Paracetamol 500mg",
        status=MedStatus.under_review,
        notes="Headache",
    ))
    db.commit()
