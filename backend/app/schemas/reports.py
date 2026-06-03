from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date


class ReportRequest(BaseModel):
    from_date: Optional[date] = None
    to_date: Optional[date] = None
    group_by: str = "day"
    type: str = "sales"
