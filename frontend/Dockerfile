# frontend/Dockerfile

# Use the standard, more compatible Node.js image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy package files (this will now include the updated package.json)
COPY package*.json ./

# Install dependencies cleanly inside the container
RUN npm install

# Now copy the rest of your source code
COPY . .

# Expose the port
EXPOSE 3000

# This command will now work correctly
CMD ["npm", "run", "dev"]