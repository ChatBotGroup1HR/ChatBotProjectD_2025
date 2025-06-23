# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Set production environment
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

# Accept build arguments for environment variables
ARG REACT_APP_POCKETBASE_URL
ARG REACT_APP_PB_SUPER_EMAIL
ARG REACT_APP_PB_SUPER_PW

# Set as environment variables for the build
ENV REACT_APP_POCKETBASE_URL=$REACT_APP_POCKETBASE_URL
ENV REACT_APP_PB_SUPER_EMAIL=$REACT_APP_PB_SUPER_EMAIL
ENV REACT_APP_PB_SUPER_PW=$REACT_APP_PB_SUPER_PW

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]