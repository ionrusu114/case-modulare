# syntax=docker/dockerfile:1

# ───────── Build (Bun) ─────────
FROM oven/bun:1.3-alpine AS build
WORKDIR /app

# Install deps first (cached unless manifest changes)
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build the static site (vue-tsc + vite-ssg prerender -> /app/dist)
COPY . .
RUN bun run build

# ───────── Runtime (nginx) ─────────
FROM nginx:1.27-alpine AS runtime
RUN apk add --no-cache curl
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
