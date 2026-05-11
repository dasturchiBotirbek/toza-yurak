# docker build -t toza-yurak .
# docker run --env-file server/.env -p 3847:3847 toza-yurak
FROM node:22-bookworm-slim

WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

COPY server ./server
COPY index.html script.js styles.css ./
COPY images ./images/

ENV NODE_ENV=production
ENV PORT=3847
ENV HOST=0.0.0.0

EXPOSE 3847

WORKDIR /app/server
CMD ["node", "server.js"]
