# GeSMS: static PWA served by nginx at gesms.artme.dev (rostok stack `gesms`).
# The first stage renders the per-language pages from src/ into dist/.
FROM node:22-alpine AS build
WORKDIR /app
COPY scripts/ ./scripts/
COPY src/ ./src/
RUN node scripts/build.mjs

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
