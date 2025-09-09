# backend/app/services/nlp_service.py

import spacy
from ..models import IssueTypeEnum

# --- Model Cache ---
# This pattern ensures the model is loaded only once, improving performance.
_nlp_cache = {}

def _load_nlp_model():
    """Loads the spaCy model into a global cache if it's not already there."""
    if "model" not in _nlp_cache:
        try:
            _nlp_cache["model"] = spacy.load("en_core_web_sm")
        except OSError:
            print("Downloading spaCy model 'en_core_web_sm'...")
            from spacy.cli import download
            download("en_core_web_sm")
            _nlp_cache["model"] = spacy.load("en_core_web_sm")
    return _nlp_cache["model"]

# --- Keyword Definitions ---
# More specific keywords for better accuracy
ISSUE_KEYWORDS = {
    IssueTypeEnum.pothole: ["pothole", "crater", "road is broken"],
    IssueTypeEnum.garbage_piles: ["garbage", "trash", "dump", "waste", "overflowing bin", "garbage piles"],
    IssueTypeEnum.street_flooding: ["water leak", "pipe burst", "flooding", "water logging", "sewage", "street flooding"],
    IssueTypeEnum.illegal_parking: ["illegal parking", "wrong parking", "parked illegally"],
    IssueTypeEnum.debris: ["debris", "rubble", "construction waste", "fallen objects"],
}

def analyze_report_text(text: str) -> dict:
    """
    Analyzes unstructured text to extract the most likely issue type and location.
    """
    nlp = _load_nlp_model()
    doc = nlp(text.lower()) # Process text in lowercase for easier matching

    # --- Extract Location using NER ---
    address = "Unknown Location"
    for ent in doc.ents:
        if ent.label_ in ["GPE", "LOC", "FAC"]: # GPE=City/Country, LOC=Non-GPE locations, FAC=Buildings/Airports
            address = ent.text.title() # Capitalize the location nicely
            break

    # --- Determine Best Issue Type using a Scoring System ---
    scores = {issue_type: 0 for issue_type in ISSUE_KEYWORDS}
    
    for issue_type, keywords in ISSUE_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text.lower():
                scores[issue_type] += 1
    
    # Find the issue type with the highest score
    if any(score > 0 for score in scores.values()):
        best_issue_type = max(scores, key=scores.get)
    else:
        best_issue_type = IssueTypeEnum.other

    # --- Generate a Title ---
    title = f"{best_issue_type.value.replace('_', ' ').title()} reported near {address}"

    return {
        "issue_type": best_issue_type,
        "address": address,
        "title": title,
    }