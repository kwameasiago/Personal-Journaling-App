# Use a more recent Node.js version that supports required package versions
FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app/Analysis

# Install app dependencies by copying package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of your application code
COPY . .

# Build the application
RUN npm run build

# Set the environment variable for host (if needed, for Docker compatibility)
ENV HOST=0.0.0.0

# Expose the port the app runs on
EXPOSE 3002

# Define the command to run your app
CMD ["node", "dist/main"]