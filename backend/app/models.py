from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class EmissionRecord(Base):
    __tablename__ = "emissions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    category = Column(String)
    scope = Column(String)
    quantity = Column(Float)
    unit = Column(String)
    emission_factor = Column(Float)
    total_emission = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
