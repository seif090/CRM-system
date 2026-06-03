from pydantic import BaseModel
from typing import Optional


class ImportRequest(BaseModel):
    entity_type: str
    file_path: Optional[str] = None
    column_mapping: Optional[str] = None


class ExportRequest(BaseModel):
    entity_type: str
    format: str = "excel"
    filters: Optional[str] = None
