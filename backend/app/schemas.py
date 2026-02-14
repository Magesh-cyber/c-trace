from pydantic import BaseModel

class InvoiceBase(BaseModel):
    text: str

class InvoiceCreate(InvoiceBase):
    class Config:
        json_schema_extra = {
            "example": {
                "text": "Purchased 500 liters of diesel fuel for the generator"
            }
        }

class Invoice(InvoiceBase):
    id: int
    category: str
    scope: str
    quantity: float
    unit: str
    emission_factor: float
    total_emission: float

    class Config:
        from_attributes = True
