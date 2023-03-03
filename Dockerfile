FROM node:16.13.1
RUN mkdir -p /app
WORKDIR /app
ADD . /app/
COPY env.sh /usr/local/bin
RUN chmod +x /usr/local/bin/env.sh
ENTRYPOINT ["env.sh"]
RUN npm run build
RUN npm run start:prod
EXPOSE 8080