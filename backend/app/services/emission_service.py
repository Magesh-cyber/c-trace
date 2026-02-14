import json
from pathlib import Path

# Load factors once
BASE_DIR = Path(__file__).resolve().parent.parent
with open(BASE_DIR / "data" / "emission_factors.json") as f:
    FACTORS = json.load(f)

def calculate_emission(material: str, quantity: float):

    material = material.lower()

    factor = FACTORS.get(material)

    if not factor:
        factor = 1.0  # fallback factor

    total = quantity * factor

    return factor, total
