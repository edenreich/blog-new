FROM node:20.2.0-bullseye-slim AS common
USER node
WORKDIR /app

FROM common AS builder
ENV NODE_ENV=development
COPY --chown=node:node . .
RUN npm ci && NODE_ENV=production npm run build

FROM common AS development
ENV NODE_ENV=development
CMD [ "npm", "run", "dev" ]

FROM nginx:1.24.0-alpine3.17-slim
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder --chown=nginx:nginx /app/out /usr/share/nginx/html
