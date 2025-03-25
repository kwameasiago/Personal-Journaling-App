# Use a more recent Node.js version that supports required package versions
FROM node:20.11.1-alpine3.19 AS build

# Create app directory
WORKDIR /usr/src/app/frontend

RUN npm config set registry "http://registry.npmjs.org"

# Install app dependencies by copying package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install --legacy-peer-deps --loglevel verbose

# Copy the rest of your application code
COPY . .

# Build the application
RUN yarn run build

# Set the environment variable for host (if needed, for Docker compatibility)
ENV HOST=0.0.0.0

# Expose the port the app runs on
EXPOSE 3030

# Define the command to run your app
CMD ["npm", "run", "preview"]