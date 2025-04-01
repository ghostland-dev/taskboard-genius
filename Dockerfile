
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and install dependencies
COPY package.json ./
RUN pnpm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the project
RUN npm run build

# Production image, copy all the files and run the app
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
