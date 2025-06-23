# 🛠 Backend Setup Guide

## Step 1: Configure `.env`

Create a `.env` file in the `backend/` folder with the following content:

```env
# Environment
PORT=3001

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=database
DB_PORT=5433  # ⚠️ Make sure this matches your PostgreSQL port

# Firebase
FIREBASE_SERVICE_ACCOUNT_KEY= # Paste your service account key here


## Step 2: Install Docker

Download Docker: https://www.docker.com/products/docker-desktop/

## Step 3: Set Up Database and Backend

cd backend 
npm install
docker compose up

## Step 4 Optional: Import NUSMods Data
npm run getMods

## Step 5: Run the backend
Option 1: Using Node.js
npm run dev
Option 2: Using Docker
docker compose up -d

## Docker Cleanup (If You Installed New Packages) 
# Stop and remove containers, networks, volumes
docker compose down -v --remove-orphans

# Remove all images and volumes
docker system prune -a -f --volumes

# Rebuild backend image from scratch
docker compose build --no-cache backend

# Start everything again
docker compose up
