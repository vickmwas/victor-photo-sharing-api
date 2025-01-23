# Photo Sharing API

## Overview
A NestJS-powered photo sharing application with AWS S3 integration and PostgreSQL database. Configured to be deployed on AWS ElasticBeanstalk

- **Production URL**: http://photo-sharing-api-v2.us-east-1.elasticbeanstalk.com/
- **Swagger Docs**: http://photo-sharing-api-v2.us-east-1.elasticbeanstalk.com/api

## Prerequisites
- Node.js (v20+)
- npm
- Docker (optional)
- AWS Account (for S3 and deployment)

## Installation & Setup

### Local Development
1. Clone the repository
```bash
git clone <repository-url>
cd photo-sharing-api
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file with required environment variables
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run start:dev
```

### Docker Deployment
```bash
docker-compose up --build
```

## Environment Variables

### Required Configuration
```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Connection
DATABASE_HOST=
DATABASE_PORT=5432
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_SSL=false

# Authentication
JWT_SECRET=

# AWS Configuration
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_PHOTOS_BUCKET_NAME=
AWS_S3_PROFILE_PHOTOS_BUCKET_NAME=

# Deployment
S3_BUCKET=
S3_KEY=deploy.zip
```

## Backend URLs
- **Production**: http://photo-sharing-api-v2.us-east-1.elasticbeanstalk.com/
- **Local Development**: http://localhost:3000/

## Available Scripts
- `npm run start:dev`: Start development server
- `npm run build`: Compile TypeScript
- `npm run start:prod`: Run production build
- `npm test`: Run unit tests
- `npm run test:e2e`: Run end-to-end tests

## API Documentation
Swagger documentation available at `/api` when the server is running.

## Deployment
Deployed automatically via GitHub Actions to AWS Elastic Beanstalk on push to `main` branch.

## Technology Stack
- NestJS
- TypeORM
- PostgreSQL
- AWS S3
- JWT Authentication
- Docker


