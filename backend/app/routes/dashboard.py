from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, extract
from app.database import SessionLocal
from app.models import EmissionRecord
import traceback
from datetime import datetime, timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_insights(total, scopes, category_data):
    insights = []
    
    if total == 0:
        return [{"title": "Getting Started", "desc": "Upload invoice data to receive AI-powered reduction strategies.", "badge": "Info", "color": "text-blue-400"}]

    # Convert category data to dict for easier lookup
    cat_dict = {c[0]: c[1] for c in category_data}
    
    # 1. Top Source Identification
    if category_data:
        top_source = category_data[0][0]
        top_val = category_data[0][1]
        percent = (top_val / total) * 100
        insights.append({
            "title": f"Main Hotspot: {top_source.title()}",
            "desc": f"{top_source.title()} accounts for {percent:.1f}% of your total footprint. Prioritize reduction here.",
            "badge": "Priority",
            "color": "text-rose-400"
        })

    # 2. Specific Actionable Recommendations based on Material/Category
    
    # Fuel / Diesel / Petrol
    fuel_emission = cat_dict.get("diesel", 0) + cat_dict.get("petrol", 0) + cat_dict.get("gas", 0)
    if fuel_emission > 0:
        insights.append({
            "title": "Fleet Electrification",
            "desc": f"Fuel consumption contributes {fuel_emission:.1f} kg CO2e. Switching to Electric Vehicles (EVs) could eliminate this.",
            "badge": "High Impact",
            "color": "text-emerald-400"
        })

    # Electricity
    elec_emission = cat_dict.get("electricity", 0)
    if elec_emission > 0:
        insights.append({
            "title": "Renewable Energy Switch",
            "desc": f"Grid electricity is a major factor ({elec_emission:.1f} kg). Installing onsite solar or switching to a green tariff can reduce Scope 2 to near zero.",
            "badge": "medium impact",
            "color": "text-yellow-400"
        })

    # Flights / Transport
    transport_emission = cat_dict.get("flights", 0) + cat_dict.get("transport", 0)
    if transport_emission > 0:
        insights.append({
            "title": "Optimize Logistics",
            "desc": "Transport emissions detected. Consolidate shipments or use rail/sea freight instead of air/road where possible.",
            "badge": "Optimization",
            "color": "text-blue-400"
        })
        
    # Materials (Scope 3)
    material_emission = cat_dict.get("steel", 0) + cat_dict.get("cement", 0)
    if material_emission > 0:
        insights.append({
            "title": "Sustainable Procurement",
            "desc": "Embrace circular economy principles. Sourcing recycled steel or low-carbon cement can significantly lower embodied carbon.",
            "badge": "Supply Chain",
            "color": "text-purple-400"
        })

    # Fallback if no specific categories matched but usage is high
    if not insights and total > 1000:
         insights.append({
            "title": "General Audit Recommended",
            "desc": "Your emissions are rising. Conduct a detailed energy audit to identify hidden inefficiencies.",
            "badge": "Audit",
            "color": "text-slate-400"
        })

    return insights


from fastapi.responses import FileResponse
from app.services.report_service import generate_pdf_report

def get_dashboard_data(db: Session):
    total = db.query(func.sum(EmissionRecord.total_emission)).scalar() or 0.0

    # Scope Breakdown
    scope_data = db.query(
        EmissionRecord.scope,
        func.sum(EmissionRecord.total_emission)
    ).group_by(EmissionRecord.scope).all()
    scopes = [[s, float(v)] for s, v in scope_data]

    # Category Breakdown (for detailed insights)
    category_data = db.query(
        EmissionRecord.category,
        func.sum(EmissionRecord.total_emission)
    ).group_by(EmissionRecord.category).order_by(desc(func.sum(EmissionRecord.total_emission))).all()
    
    cats = [[c, float(v)] for c, v in category_data]

    # History Data (Last 30 days)
    history_data = db.query(
        func.strftime('%Y-%m-%d', EmissionRecord.created_at).label('date'),
        func.sum(EmissionRecord.total_emission)
    ).group_by('date').order_by('date').all()
    
    history_dict = {h[0]: float(h[1]) for h in history_data}
    
    history = []
    # Generate last 30 days
    today = datetime.now()
    for i in range(29, -1, -1):
        date = (today - timedelta(days=i)).strftime('%Y-%m-%d')
        history.append({
            "date": date,
            "value": history_dict.get(date, 0.0)
        })

    insights = generate_insights(total, scopes, cats)

    # Scope Ratios
    scope_ratios = {}
    if total > 0:
        for s, v in scopes:
            scope_ratios[s] = (v / total) * 100

    return {
        "total_emission": float(total),
        "by_scope": scopes,
        "scope_ratios": scope_ratios,
        "history": history,
        "insights": insights
    }

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    try:
        print("Dashboard request received")
        data = get_dashboard_data(db)
        print(f"Returning dashboard data: total={data['total_emission']}")
        return data
    except Exception as e:
        print(f"Error in dashboard: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import BackgroundTasks
import os

from fastapi import Response

@router.get("/report")
def download_report(db: Session = Depends(get_db)):
    try:
        data = get_dashboard_data(db)
        pdf_bytes = generate_pdf_report(data)
        
        return Response(content=pdf_bytes, media_type='application/pdf', headers={
            'Content-Disposition': 'attachment; filename="C-Trace_Executive_Report.pdf"'
        })
    except Exception as e:
        print(f"Error generating report: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/reset")
def reset_data(db: Session = Depends(get_db)):
    try:
        db.query(EmissionRecord).delete()
        db.commit()
        return {"message": "All data reset successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
