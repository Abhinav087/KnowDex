from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = ""


class WorkspaceOut(BaseModel):
    id: int
    name: str
    description: str
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True
