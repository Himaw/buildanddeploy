# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Development ----
# Includes all dependencies; src is volume-mounted for hot reload.
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["node", "--watch", "src/index.js"]

# ---- Production ----
# Only production dependencies; no dev tooling in the final image.
FROM base AS production
RUN npm ci --omit=dev
COPY src/ ./src/
EXPOSE 3000
CMD ["node", "src/index.js"]
