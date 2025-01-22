#!/bin/bash
set -e

echo "Applying configurations..."

# Modify postgresql.conf
echo "listen_addresses = '*'" >> "$PGDATA/postgresql.conf"

# Modify pg_hba.conf
echo "host    all             all             172.18.0.0/16            md5" >> "$PGDATA/pg_hba.conf"

# Restart PostgreSQL
pg_ctl -D "$PGDATA" -m fast -w restart

echo "Initialization complete."