#!/bin/bash
echo "=========================================="
echo "     Knowdex AI - Database Reset Tool"
echo "=========================================="
echo ""
echo "[WARNING] This will delete the database."
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "1. Deleting old database..."
rm -f knowdex.db
if [ -f "knowdex.db" ]; then
    echo "[ERROR] Failed to delete database."
    exit 1
fi
echo "Database deleted successfully."

echo ""
echo "=========================================="
echo "      Success! Database Reset."
echo "=========================================="
echo "Please restart the backend server."
echo "The database tables will be recreated automatically on startup."
