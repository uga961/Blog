#!/usr/bin/env bash
# ==========================================
# Database & Media Restore Script
# Usage: ./scripts/restore.sh ./backups/db_YYYYMMDD.sql.gz [./backups/uploads_YYYYMMDD.tar.gz]
# ==========================================
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <path-to-db-backup.sql.gz> [path-to-uploads.tar.gz]"
  exit 1
fi

DB_BACKUP="$1"
UPLOADS_BACKUP="${2:-}"
DB_CONTAINER="blog_db"
DB_USER="${POSTGRES_USER:-blog_user}"
DB_NAME="${POSTGRES_DB:-blog_db}"

echo "⚠️  Restoring database from ${DB_BACKUP}..."

if [ ! -f "${DB_BACKUP}" ]; then
  echo "❌ Error: Backup file not found: ${DB_BACKUP}"
  exit 1
fi

# Restore Postgres database into Docker container
if docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
  echo "Restoring into container ${DB_CONTAINER}..."
  gunzip -c "${DB_BACKUP}" | docker exec -i "${DB_CONTAINER}" psql -U "${DB_USER}" -d "${DB_NAME}"
  echo "✓ Database restored successfully."
else
  echo "❌ Docker container ${DB_CONTAINER} is not running."
  exit 1
fi

# Restore uploads if provided
if [ -n "${UPLOADS_BACKUP}" ] && [ -f "${UPLOADS_BACKUP}" ]; then
  echo "Restoring uploads from ${UPLOADS_BACKUP}..."
  tar -xzf "${UPLOADS_BACKUP}" -C "./public"
  echo "✓ Uploads restored successfully."
fi

echo "✅ Restoration completed!"
