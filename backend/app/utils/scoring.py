def calculate_urgency_score(issue_type: str, latitude: float, longitude: float, frequency: int = 1) -> float:
    base_score = {
        "pothole": 6,
        "leak": 7,
        "garbage": 5,
        "light": 4,
        "wire": 8,
        "sign": 3
    }.get(issue_type.lower(), 5)

    location_factor = 1.0
    if is_near_school_or_hospital(latitude, longitude):
        location_factor = 1.5

    score = base_score * location_factor + frequency * 0.5
    return min(score, 10.0)  # Clamp between 0 and 10


def is_near_school_or_hospital(lat: float, lon: float) -> bool:
    # Dummy version for now
    return False