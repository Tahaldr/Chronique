# Use node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for backend
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY . .

# Install frontend dependencies and build frontend
RUN npm install --prefix client
RUN npm run build --prefix client

# Expose the port your backend listens on (change if needed)
EXPOSE 5000

# Set environment variable
ENV NODE_ENV=production

# Default command to start your backend (adjust if you use something else)
CMD ["npm", "start"]

