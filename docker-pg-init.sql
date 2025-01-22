-- Allow all connections from the Docker network (adjust the CIDR range if needed)
ALTER SYSTEM SET listen_addresses = '*';

-- Reload PostgreSQL to apply changes
SELECT pg_reload_conf();