# MedReco console — Nuxt 4 (build, then run the Nitro server).
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV PORT=3000
ENV HOST=0.0.0.0
# NUXT_PUBLIC_API_BASE is supplied at runtime (see docker-compose.yml).
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
