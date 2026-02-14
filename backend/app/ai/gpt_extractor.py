def extract_invoice_data(text: str):

    text = text.lower()

    if "diesel" in text:
        return {"material": "diesel", "quantity": 500, "unit": "liters"}

    if "electricity" in text:
        return {"material": "electricity", "quantity": 1000, "unit": "kwh"}

    if "steel" in text:
        return {"material": "steel", "quantity": 5, "unit": "ton"}

    # fallback
    return {"material": "transport", "quantity": 1000, "unit": "km"}
