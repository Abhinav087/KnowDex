from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PaperCreate(BaseModel):
    title: str
    authors: Optional[str] = ""
    abstract: Optional[str] = ""
    source_url: Optional[str] = ""
    workspace_id: int


class PaperOut(BaseModel):
    id: int
    title: str
    authors: str
    abstract: str
    source_url: str
    file_path: str
    workspace_id: int
    created_at: datetime

    class Config:
        from_attributes = True
