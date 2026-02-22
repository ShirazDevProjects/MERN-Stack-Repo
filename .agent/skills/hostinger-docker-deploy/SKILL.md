---
name: hostinger-docker-deploy
description: "Prepare and deploy an application (React, Next.js, MERN, etc.) to Hostinger Docker Manager using Docker and Docker Compose."
---

# Hostinger Docker Deployment Skill

This skill helps configure any web project (React, Next.js, MERN stack, etc.) for easy deployment using Hostinger's Docker Manager or any standard VPS running Docker.

## Step 1: Analyze the Project Scope & Requirements
1. **Determine the type of project** to be deployed:
   - **Simple Frontend (React/Vite)**: Needs a build step and an Nginx container to serve static files.
   - **SSR/Full-stack Framework (Next.js)**: Needs an optimized Node.js runtime environment.
   - **MERN Stack**: Needs a Frontend container (React + Nginx) and a Backend container (Node.js/Express) connected via a Docker network, and possibly a MongoDB container (if not using MongoDB Atlas).
2. **Ask for the Domain Name**: Explicitly prompt the user to provide the domain name (e.g., `example.com`) where the application will be hosted. This is crucial for correctly configuring the `server_name` in the `nginx.conf` file for Nginx-based setups.

## Step 2: Generate the Necessary `Dockerfile`s
Create or update `Dockerfile`s based on the project architecture.

### 2a. React/Vite Frontend (Nginx)
Create `Dockerfile` (or `client/Dockerfile`):
```dockerfile
# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Include custom nginx.conf if needed for reverse proxying or React routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
*(Ensure you also generate a basic `nginx.conf` that redirects to `index.html` for client-side routing).*

### 2b. Next.js App
Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```
*(Requires setting `output: 'standalone'` in `next.config.js`)*

### 2c. Node.js/Express Backend (MERN)
Create `server/Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## Step 3: Create `.dockerignore`
Ensure every directory containing a Dockerfile has a `.dockerignore` to keep builds fast and clean:
```
node_modules
dist
build
.next
.git
.env
Dockerfile
docker-compose.yml
```

## Step 4: Create `docker-compose.yml`
Generate a `docker-compose.yml` at the root of the project. Tailor it to the project context.

### Example: Full MERN Stack
```yaml
version: '3.8'
services:
  backend:
    build: ./server
    restart: unless-stopped
    env_file:
      - ./server/.env
    networks:
      - app-network

  frontend:
    build: ./client
    restart: unless-stopped
    ports:
      - "80:80"        # Hostinger public port mapping
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Example: Next.js or React Only
```yaml
version: '3.8'
services:
  web:
    build: .
    restart: unless-stopped
    ports:
      - "80:3000" # Map to standard HTTP port if Next.js (3000) or Nginx (80)
```

## Step 5: Hostinger Deployment Instructions
Once files are created, instruct the user on how to deploy them to Hostinger:

1. **Commit and Push**: Push all these Docker config files to the project's Git repository.
2. **Access Hostinger VPS**: SSH into the Hostinger VPS (or use the Hostinger VPS Browser Terminal) and clone/pull the latest changes.
   *(Alternatively, use SFTP to upload files directly if Git is not used).*
3. **Environment Variables**: Remind the user to securely create their `.env` files directly on the Hostinger server before building. (`nano .env`)
4. **Run Docker Compose**: 
   Inside the project directory on the VPS, run the following to build and deploy:
   ```bash
   docker compose up -d --build
   ```

## Execution Rules
- **Do NOT** embed secrets or API keys in the `Dockerfile` or `docker-compose.yml`. Use `env_file`.
- Always configure Nginx with `client_max_body_size` and correct `proxy_pass` blocks if routing to a backend in MERN stacks. Ensure the `server_name` in `nginx.conf` is accurately set to the user's provided domain name.
- Always implement the Next.js standalone build for optimized Hostinger VPS resource usage to keep the container lightweight.
