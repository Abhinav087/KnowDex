from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime, timezone
from app.core.database import Base


class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    authors = Column(String, default="")
    abstract = Column(Text, default="")
    full_text = Column(Text, default="")
    source_url = Column(String, default="")
    file_path = Column(String, default="")
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
