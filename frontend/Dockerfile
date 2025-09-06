# frontend/Dockerfile (NEW Production-Ready Version)

# --- Build Stage ---
# Use the official Node.js image to create the production build of the React app.
FROM node:18-slim as builder

WORKDIR /app

# Increase the memory available to Node.js.
# This is the crucial fix to prevent memory-related crashes during `npm install`.
ENV NODE_OPTIONS=--max-old-space-size=4096

# Copy package files and install dependencies.
# Using the lockfile ensures consistent, reliable builds.
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code.
COPY . .

# Build the React application for production.
RUN npm run build

# --- Serve Stage ---
# Use a lightweight and highly optimized Nginx server for serving static files.
FROM nginx:stable-alpine

# Copy the built React application from the 'builder' stage into the Nginx public folder.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration file.
# This is a best practice for single-page applications (SPAs) like React.
# It ensures that all routes are correctly handled by your index.html file.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80, which is the default port for Nginx.
EXPOSE 80

# The default Nginx command will start the server automatically when the container runs.
