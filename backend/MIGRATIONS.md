# Database Migration System

## Overview

This project uses a simple migration system to handle database schema changes. The migration system automatically updates existing databases when the application starts.

## How It Works

1. When the application starts (`app/main.py`), it calls `run_migrations(engine)` before creating tables
2. The migration system (`app/core/migrations.py`) checks for missing columns and adds them
3. After migrations, `Base.metadata.create_all()` creates any missing tables

## Current Migrations

### Migration: Add full_text column to papers table

**Issue**: The `papers` table was created without the `full_text` column that was later added to the Paper model.

**Solution**: The migration automatically adds the `full_text` column if it's missing.

**Details**:
- Column type: TEXT
- Default value: "" (empty string)
- Nullable: Yes (SQLite doesn't enforce NOT NULL unless specified)

## For Developers

### Adding a New Migration

To add a new migration, edit `app/core/migrations.py`:

```python
def run_migrations(engine: Engine):
    """Run all necessary database migrations."""
    inspector = inspect(engine)
    
    # Example: Add new column to existing table
    if 'table_name' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('table_name')]
        if 'new_column' not in columns:
            logger.info("Adding 'new_column' to 'table_name'...")
            with engine.connect() as conn:
                conn.execute(text('ALTER TABLE table_name ADD COLUMN new_column TYPE DEFAULT value'))
                conn.commit()
            logger.info("Successfully added 'new_column'")
```

### Migration Principles

1. **Idempotent**: Migrations should be safe to run multiple times
2. **Check First**: Always check if a change is needed before applying it
3. **Log**: Log migration actions for debugging
4. **Backward Compatible**: Ensure migrations don't break existing data

## Resetting the Database

If you need to completely reset the database:

**Windows**: Run `fix_db.bat` (located in project root)
**Linux/Mac**: Run `./fix_db.sh` (located in project root)

This will delete the database file. The tables will be automatically recreated on next startup.

**Note**: Resetting the database will delete all data. Use migrations instead when possible to preserve data.

## Troubleshooting

### "no such column" error

This error occurs when the database schema doesn't match the model definitions. The migration system should automatically fix this on startup.

If the error persists:
1. Check the logs to see if the migration ran
2. Verify the column was added: `sqlite3 knowdex.db "PRAGMA table_info(papers);"`
3. Try resetting the database using the fix_db script

### Migration not running

Ensure the application is starting correctly and check the logs for migration messages.
