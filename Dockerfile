FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy pre-built files and other necessary files
COPY dist/ ./dist/
COPY atphotobackend-b9d66802c105.json ./

EXPOSE 3000

CMD ["npm", "start"]