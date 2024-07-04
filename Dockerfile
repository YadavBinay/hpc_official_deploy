# Use a slim Node.js image with Alpine Linux for efficiency
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json file first (for caching benefits)
COPY package*.json ./

# Install dependencies based on package.json
RUN npm install

# Copy the rest of your project files
COPY . .

# Expose port 3000 (typical for Express.js apps)
EXPOSE 3000

# Start the application using the defined script
CMD [ "npm", "start" ]
