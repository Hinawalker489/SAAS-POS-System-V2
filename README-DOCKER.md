# Docker Deployment Guide

This guide explains how to run the SaaS POS System using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Quick Start

### Using Docker Compose (Recommended)

1. **Set environment variables** (optional, defaults are provided):
   ```bash
   # Create a .env file or export these variables
   export NEXTAUTH_SECRET="your-secret-key-change-this-in-production-min-32-chars"
   export NEXTAUTH_URL="http://localhost:4000"
   ```

2. **Build and run**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Open your browser and navigate to `http://localhost:4000`
   - The database will be automatically migrated on first startup

4. **View logs**:
   ```bash
   docker-compose logs -f
   ```

5. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Using Docker directly

1. **Build the image**:
   ```bash
   docker build -t saas-pos .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name saas-pos \
     -p 4000:4000 \
     -e DATABASE_URL=file:./data/dev.db \
     -e NEXTAUTH_SECRET="your-secret-key-change-this-in-production-min-32-chars" \
     -e NEXTAUTH_URL="http://localhost:4000" \
     -v $(pwd)/data:/app/data \
     -v $(pwd)/prisma:/app/prisma \
     saas-pos
   ```

3. **Access the application**:
   - Open your browser and navigate to `http://localhost:4000`

4. **View logs**:
   ```bash
   docker logs -f saas-pos
   ```

5. **Stop the container**:
   ```bash
   docker stop saas-pos
   docker rm saas-pos
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database file path | `file:./data/dev.db` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js (min 32 chars) | Required |
| `NEXTAUTH_URL` | Base URL of your application | `http://localhost:4000` |
| `NODE_ENV` | Node environment | `production` |

## Data Persistence

The database file is stored in the `./data` directory, which is mounted as a volume. This ensures your data persists even if you remove and recreate the container.

## Database Migrations

Database migrations run automatically when the container starts. The first time you run the container, it will:
1. Create the database file if it doesn't exist
2. Run all pending migrations
3. Start the application

## Troubleshooting

### Port already in use

If port 4000 is already in use, change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "4001:4000"  # Use port 4001 on host
```

### Database issues

If you encounter database errors:
1. Stop the container
2. Remove the `./data` directory (this will delete all data!)
3. Restart the container

### Build errors

If the build fails:
1. Ensure you have Docker installed and running
2. Check that all files are present
3. Review the build logs: `docker-compose build --no-cache`

## Production Deployment

For production deployment:

1. **Set strong secrets**:
   ```bash
   export NEXTAUTH_SECRET=$(openssl rand -base64 32)
   ```

2. **Update NEXTAUTH_URL** to your production domain:
   ```bash
   export NEXTAUTH_URL="https://yourdomain.com"
   ```

3. **Use a reverse proxy** (nginx, Traefik, etc.) for SSL/TLS

4. **Set up regular backups** of the `./data` directory

5. **Monitor logs**:
   ```bash
   docker-compose logs -f saas-pos
   ```

## Building for Different Platforms

To build for a specific platform (e.g., ARM64):

```bash
docker buildx build --platform linux/arm64 -t saas-pos .
```

