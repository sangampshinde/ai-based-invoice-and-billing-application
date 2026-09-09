# Stage 1: Build NestJS TypeScript code
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm ci

# Copy source code and build
COPY src ./src
RUN npm run build

# Stage 2: Production runtime image (AWS Lambda & Container compatible)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000
ENV AWS_LWA_PORT=8000
ENV AWS_LWA_READINESS_CHECK_PATH=/health

# Copy AWS Lambda Web Adapter (enables seamless execution inside AWS Lambda container image runtime)
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/main.js"]
