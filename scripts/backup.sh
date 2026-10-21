#!/usr/bin/env bash
# ==========================================
# Automated Database & Media Backup Script
# ==========================================
set -euo pipefail

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER="blog_db"
DB_USER="${POSTGRES_USER:-blog_user}"
DB_NAME="${POSTGRES_DB:-blog_db}"

mkdir -p "${BACKUP_DIR}"

echo "📦 Starting backup at ${TIMESTAMP}..."

# 1. Backup PostgreSQL database from docker container
if docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
  echo "Dumping database ${DB_NAME} from container ${DB_CONTAINER}..."
  docker exec -t "${DB_CONTAINER}" pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip > "${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz"
  echo "✓ Database backup saved: ${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz"
else
  echo "⚠️ Container ${DB_CONTAINER} not running. Checking local pg_dump..."
  if command -v pg_dump >/dev/null 2>&1; then
    pg_dump "${DATABASE_URL}" | gzip > "${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz"
    echo "✓ Database backup saved: ${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz"
  fi
fi

# 2. Backup Uploads directory
if [ -d "./public/uploads" ] && [ "$(ls -A ./public/uploads)" ]; then
  echo "Archiving uploads directory..."
  tar -czf "${BACKUP_DIR}/uploads_${TIMESTAMP}.tar.gz" -C "./public" uploads
  echo "✓ Uploads backup saved: ${BACKUP_DIR}/uploads_${TIMESTAMP}.tar.gz"
fi

# 3. Clean backups older than 30 days
find "${BACKUP_DIR}" -type f -name "*.gz" -mtime +30 -delete

echo "✅ Backup process complete!"
