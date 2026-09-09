# 🚀 Complete Deployment Guide: Docker & AWS Lambda

This guide walks you through deploying both the **NestJS Backend** and **Next.js Frontend** to **AWS Lambda** using **Docker Container Images** and the **AWS Lambda Web Adapter**.

---

## 🏗️ Architecture Overview

- **Backend (NestJS)**: Packaged into a Docker container image with AWS Lambda Web Adapter (`AWS_LWA_PORT=8000`), deployed as an AWS Lambda Function with a Function URL or API Gateway.
- **Frontend (Next.js)**: Built with Next.js `standalone` mode and AWS Lambda Web Adapter (`AWS_LWA_PORT=3000`), deployed as an AWS Lambda Function with Function URL.
- **Database & Redis**: Connected to cloud databases (e.g., **Neon / AWS RDS PostgreSQL** for database, **Upstash / AWS ElastiCache** for Redis).

---

## 📋 Prerequisites

1. **AWS CLI** installed and configured (`aws configure`).
2. **Docker** installed and running on your system.
3. Managed PostgreSQL connection string (`DATABASE_URL` or Host/User/Pass).
4. Google Gemini API Key (`GEMINI_API_KEY`).

---

## 🧪 Local Verification with Docker Compose

Before deploying to AWS, you can test the full stack (PostgreSQL + Redis + Backend + Frontend) locally:

```bash
# In the project root directory:
docker compose up --build
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api](http://localhost:8000/api)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## ☁️ Step-by-Step AWS Lambda Deployment

### Step 1: Set Variables in PowerShell / Bash

Replace values with your AWS account ID and preferred region (e.g., `us-east-1` or `ap-south-1`):

**In PowerShell (Windows):**
```powershell
$AWS_REGION = "ap-south-1"
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)
$BACKEND_REPO = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/invoicer-backend"
$FRONTEND_REPO = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/invoicer-frontend"
```

**In Bash (Linux / Mac):**
```bash
export AWS_REGION="ap-south-1"
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export BACKEND_REPO="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/invoicer-backend"
export FRONTEND_REPO="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/invoicer-frontend"
```

---

### Step 2: Create Amazon ECR Repositories

```bash
# Create Backend ECR Repository
aws ecr create-repository --repository-name invoicer-backend --region $AWS_REGION

# Create Frontend ECR Repository
aws ecr create-repository --repository-name invoicer-frontend --region $AWS_REGION
```

---

### Step 3: Authenticate Docker with Amazon ECR

```bash
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
```

---

### Step 4: Build & Push Backend Docker Image

```bash
# Build backend image (targeting linux/amd64 for AWS Lambda)
docker build --platform linux/amd64 -t invoicer-backend ./backend

# Tag and push to ECR
docker tag invoicer-backend:latest "$BACKEND_REPO:latest"
docker push "$BACKEND_REPO:latest"
```

---

### Step 5: Build & Push Frontend Docker Image

```bash
# Build frontend image (targeting linux/amd64 for AWS Lambda)
docker build --platform linux/amd64 -t invoicer-frontend ./frontend

# Tag and push to ECR
docker tag invoicer-frontend:latest "$FRONTEND_REPO:latest"
docker push "$FRONTEND_REPO:latest"
```

---

### Step 6: Create AWS IAM Role for Lambda Execution

If you don't already have a basic Lambda execution role:

```bash
# Create trust policy file
echo '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' > lambda-trust-policy.json

# Create IAM Role
aws iam create-role --role-name invoicer-lambda-role --assume-role-policy-document file://lambda-trust-policy.json

# Attach basic execution policy
aws iam attach-role-policy --role-name invoicer-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

Wait ~10 seconds for the IAM role propagation.

---

### Step 7: Create & Deploy Backend Lambda Function

```bash
# Create Lambda Function from Backend Container Image
aws lambda create-function \
  --function-name invoicer-backend \
  --package-type Image \
  --code ImageUri="$BACKEND_REPO:latest" \
  --role "arn:aws:iam::$AWS_ACCOUNT_ID:role/invoicer-lambda-role" \
  --timeout 30 \
  --memory-size 1024 \
  --region $AWS_REGION
```

#### Configure Backend Environment Variables:
```bash
aws lambda update-function-configuration \
  --function-name invoicer-backend \
  --region $AWS_REGION \
  --environment "Variables={NODE_ENV=production,PORT=8000,AWS_LWA_PORT=8000,DATABASE_URL='postgresql://user:pass@host/dbname?sslmode=require',REDIS_HOST='your-redis-host',REDIS_PORT=6379,REDIS_PASSWORD='your-redis-pass',JWT_SECRET='your-strong-jwt-secret',GEMINI_API_KEY='your-gemini-key',CLIENT_URL='*'}"
```

#### Enable Backend Lambda Function URL (Public HTTP Endpoint):
```bash
aws lambda create-function-url-config \
  --function-name invoicer-backend \
  --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"],"AllowCredentials":true}' \
  --region $AWS_REGION

aws lambda add-permission \
  --function-name invoicer-backend \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region $AWS_REGION
```

> 📌 Note your **Backend Function URL** (e.g. `https://xyz123.lambda-url.ap-south-1.on.aws/`).

---

### Step 8: Create & Deploy Frontend Lambda Function

```bash
# Create Lambda Function from Frontend Container Image
aws lambda create-function \
  --function-name invoicer-frontend \
  --package-type Image \
  --code ImageUri="$FRONTEND_REPO:latest" \
  --role "arn:aws:iam::$AWS_ACCOUNT_ID:role/invoicer-lambda-role" \
  --timeout 30 \
  --memory-size 1024 \
  --region $AWS_REGION
```

#### Configure Frontend Environment Variables (linking Backend URL):
```bash
# Replace <BACKEND_FUNCTION_URL> with the URL from Step 7 (without trailing slash)
aws lambda update-function-configuration \
  --function-name invoicer-frontend \
  --region $AWS_REGION \
  --environment "Variables={NODE_ENV=production,PORT=3000,AWS_LWA_PORT=3000,BACKEND_URL='https://xyz123.lambda-url.ap-south-1.on.aws'}"
```

#### Enable Frontend Lambda Function URL:
```bash
aws lambda create-function-url-config \
  --function-name invoicer-frontend \
  --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"]}' \
  --region $AWS_REGION

aws lambda add-permission \
  --function-name invoicer-frontend \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region $AWS_REGION
```

---

## 🔄 Updating Your Application

Whenever you make changes to backend or frontend code:

```bash
# 1. Build and push new image
docker build --platform linux/amd64 -t invoicer-backend ./backend
docker tag invoicer-backend:latest "$BACKEND_REPO:latest"
docker push "$BACKEND_REPO:latest"

# 2. Tell Lambda to update to the latest image
aws lambda update-function-code \
  --function-name invoicer-backend \
  --image-uri "$BACKEND_REPO:latest" \
  --region $AWS_REGION
```

---

## ⚡ Key Optimizations & Tips for AWS Lambda

1. **Cold Starts**:
   - NestJS and Next.js start in < 1-2 seconds with the Lambda Web Adapter.
   - Recommended memory: `1024 MB` or `1536 MB` (Lambda allocates vCPU proportional to memory, giving faster execution).
2. **Database Pooling**:
   - For PostgreSQL in Lambda, use connection pooling like **Neon connection pooling**, **PgBouncer**, or **AWS RDS Proxy** to prevent hitting max connection limits during high concurrency.
3. **Keep-Warm**:
   - You can set up an EventBridge rule to ping `/health` every 5 minutes to keep Lambda warm.
