"""
Database migration utilities for handling schema changes.
"""
from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine
import logging

logger = logging.getLogger(__name__)


def run_migrations(engine: Engine):
    """
    Run all necessary database migrations.
    This function checks and applies schema changes to existing databases.
    """
    inspector = inspect(engine)
    
    # Migration: Add full_text column to papers table if it doesn't exist
    if 'papers' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('papers')]
        if 'full_text' not in columns:
            logger.info("Adding 'full_text' column to 'papers' table...")
            with engine.connect() as conn:
                conn.execute(text('ALTER TABLE papers ADD COLUMN full_text TEXT DEFAULT ""'))
                conn.commit()
            logger.info("Successfully added 'full_text' column to 'papers' table")
