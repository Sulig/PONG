# ========================================
# Optimized Multi-Stage Dockerfile
# Node.js TypeScript Application
# ========================================
ARG NODE_VERSION=lts-alpine
FROM node:${NODE_VERSION} AS base

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# ========================================
# Dependencies Stage
# ========================================
FROM base AS deps

# Copy package files
COPY --chown=nodejs:nodejs ./package*.json /app

# Install production dependencies
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --omit=dev && \
    npm cache clean --force

# ========================================
# Build Dependencies Stage
# ========================================
FROM base AS build-deps

# Copy package files
COPY --chown=nodejs:nodejs ./package*.json /app

# Install all dependencies with build optimizations
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --no-audit --no-fund && \
    npm cache clean --force

# Create necessary directories and set permissions
RUN mkdir -p /app/node_modules/.vite && \
    chown -R nodejs:nodejs /app/node_modules/.vite

# ========================================
# Build Stage
# ========================================
FROM build-deps AS build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copy only necessary files for building (respects .dockerignore)
COPY --chown=nodejs:nodejs ./ /app

# Build the application
RUN npm run build

# ========================================
# Development Stage
# ========================================
FROM build-deps AS development

ARG NODE_ENV \
	NPM_CONFIG_LOGLEVEL \
	PORT

# Set environment
ENV NODE_ENV=${NODE_ENV} \
    NPM_CONFIG_LOGLEVEL=${NPM_CONFIG_LOGLEVEL}

# Copy source files
COPY --chown=nodejs:nodejs ./ /app

# Ensure all directories have proper permissions
RUN mkdir -p /app/node_modules/.vite && \
    chown -R nodejs:nodejs /app/node_modules/.vite

# Switch to non-root user
USER nodejs

# Expose ports
EXPOSE ${PORT}

# Start development server
#ENTRYPOINT ["tail", "-f"]
CMD ["npm", "run", "dev", "--", "--host"]

# ========================================
# Production Stage
# ========================================
ARG NODE_VERSION=lts-alpine
FROM node:${NODE_VERSION} AS production

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Set optimized environment variables
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=256 --no-warnings" \
    NPM_CONFIG_LOGLEVEL=silent

# Copy production dependencies from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nodejs:nodejs /app/package*.json ./
# Copy built application from build stage
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist

# Switch to non-root user
USER nodejs
CMD ["/bin/sh", "-c", "echo 'Build complete' && exit 0"]
