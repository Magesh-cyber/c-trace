from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import InvoiceCreate
from app.services.parser_service import extract_invoice_data
from app.services.emission_service import calculate_emission
from app.services.scope_service import classify_scope
from app.models import EmissionRecord

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
def upload_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    try:
        parsed = extract_invoice_data(invoice.text)

        material = parsed["material"]
        quantity = parsed["quantity"]
        unit = parsed["unit"]

        factor, total = calculate_emission(material, quantity)

        scope = classify_scope(material)

        record = EmissionRecord(
            description=invoice.text,
            category=material,
            scope=scope,
            quantity=quantity,
            unit=unit,
            emission_factor=factor,
            total_emission=total
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return record
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
