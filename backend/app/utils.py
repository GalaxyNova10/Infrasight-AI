# app/utils.py

from typing import Tuple
import math

# Simple urgency score based on confidence and issue type weight
def calculate_urgency(confidence: float, issue_type: str) -> int:
    base_weights = {
        "pothole": 3,
        "water_leak": 4,
        "broken_bin": 2,
        "streetlight_outage": 1
    }
    base_score = base_weights.get(issue_type, 1)
    urgency_score = int(confidence * 7 + base_score)  # Adjust scaling factor as needed
    return min(urgency_score, 10)  # Cap at 10 for safety


# Optional: Calculate haversine distance between two lat/lon pairs
def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371  # Radius of Earth in km
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)

    a = math.sin(d_lat / 2) ** 2 + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance  # in kilometers


# Optional: Convert lat/lon to location string
def stringify_location(lat: float, lon: float) -> str:
    return f"{lat:.6f},{lon:.6f}"


# Optional: Reverse location string to lat/lon
def parse_location_string(location: str) -> Tuple[float, float]:
    lat_str, lon_str = location.split(",")
    return float(lat_str), float(lon_str)