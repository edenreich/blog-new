FROM node:17.1.0-alpine3.12 AS common
RUN apk add --update libc6-compat
USER node
WORKDIR /app

FROM common AS builder
ENV NODE_ENV=development
COPY --chown=node:node . .
RUN npm ci && NODE_ENV=production npm run build

FROM common AS development
ENV NODE_ENV=development
CMD [ "npm", "run", "dev" ]

FROM nginx:1.24.0-alpine3.17-slim AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder --chown=nginx:nginx /app/out /usr/share/nginx/html
