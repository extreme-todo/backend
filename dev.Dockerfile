FROM node:16.13.0-bullseye

WORKDIR /app

COPY package*.json .
RUN npm ci

ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 8080
CMD ["npm", "run", "start:dev"]
