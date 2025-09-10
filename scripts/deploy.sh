#!/bin/bash

# Exit on error
set -e

# Navigate to the backend directory
cd /var/www/backend

# Stash local changes if necessary to avoid conflicts during git pull
echo "Stashing any local changes to avoid merge conflicts..."
git stash --include-untracked

# Pull the latest changes from GitHub
echo "Pulling latest changes from GitHub..."
git fetch origin           # Fetch latest changes from the remote repository
git reset --hard origin/main  # Hard reset to the latest commit on main branch

# Install all dependencies, including devDependencies
echo "Installing npm dependencies..."
npm install

# Build the project (TypeScript to JavaScript)
echo "Building the project..."
npm run build

# Restart the backend using PM2
echo "Restarting the backend service with PM2..."
pm2 restart backend || pm2 start npm --name backend -- start

echo "Deployment completed successfully!"
