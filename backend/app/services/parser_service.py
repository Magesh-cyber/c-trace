def extract_invoice_data(text: str):

    text = text.lower()

    if "diesel" in text:
        return {"material": "diesel", "quantity": 500, "unit": "liters"}

    if "electricity" in text:
        return {"material": "electricity", "quantity": 1000, "unit": "kwh"}

    if "steel" in text:
        return {"material": "steel", "quantity": 5, "unit": "ton"}

    if "flight" in text:
        return {"material": "flights", "quantity": 2000, "unit": "km"}

    return {"material": "transport", "quantity": 1000, "unit": "km"}
