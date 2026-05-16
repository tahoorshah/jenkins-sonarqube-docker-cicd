# Node 22 LTS Alpine — small and secure
FROM node:22-alpine
# Create a non-root user (security best practice)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
# Copy lock file first — Docker caches this layer
COPY package*.json ./
RUN npm ci --only=production
COPY . .
# Drop privileges
USER appuser
EXPOSE 3000
# Built-in health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
 CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "app.js"]
