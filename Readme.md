# Application Setup Guide

## Overview

This guide explains two ways to set up the application: a quick setup using the provided script, and a manual setup process. The environment is already configured with .env files for convenience.

---

## 1. Quick Setup

### Steps

1. **Make the Build Script Executable (if necessary)**
    
    - Run:
        
        ```bash
        chmod +x build.sh
        ```
        
2. **Execute the Build Script**
    
    - Run:
        
        ```bash
        ./build.sh
        ```
        
    - This will build Docker containers, start them in detached mode, and run necessary commands to synchronize and seed the databases.
        
3. **Start the Frontend**
    
    - Change directory to the frontend folder:
        
        ```bash
        cd frontend
        ```
        
    - Install dependencies:
        
        ```bash
        npm install
        ```
        
    - Start the development server:
        
        ```bash
        npm start dev
        ```
        

---

## 2. Manual Setup

### A. Docker Containers

1. **Build Containers**
    
    - Use Docker Compose with your configuration file:
        
        ```bash
        docker compose -f dev-docker-composer.yml build
        ```
        
2. **Start Containers**
    
    - Run:
        
        ```bash
        docker compose -f dev-docker-composer.yml up -d --remove-orphans
        ```
        

### B. Database Setup for Services

For each service, perform the following:

1. **Drop Existing Schema**
    
    - For example, for a service like `users-api`:
        
        ```bash
        docker compose -f dev-docker-composer.yml run users-api sh -c "npx typeorm-ts-node-commonjs schema:drop -d src/config/data-source-development.ts"
        ```
        
2. **Synchronize Schema and Seed Data**
    
    - For example, for `users-api`:
        
        ```bash
        docker compose -f dev-docker-composer.yml run users-api sh -c "npx typeorm-ts-node-commonjs schema:sync -d src/config/data-source-development.ts && npm run seed"
        ```
        

Repeat the above two steps for:

- **journals-api**
    
- **analysis-api**
    

### C. Frontend Setup

1. **Navigate to the Frontend Directory**
    
    - Run:
        
        ```bash
        cd frontend
        ```
        
2. **Install Dependencies**
    
    - Run:
        
        ```bash
        npm install
        ```
        
3. **Start the Development Server**
    
    - Run:
        
        ```bash
        npm start dev
        ```
        

---

## Final Notes

- **.env Files**:  
    The necessary environment configuration is provided via the .env.local files. Ensure these are in the correct locations.
    
- **Troubleshooting**:  
    If you experience issues, review Docker logs (`docker compose logs`) and confirm that prerequisites (Docker, Node.js, npm) are correctly installed.
    
