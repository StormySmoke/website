FROM node:9.10.0-alpine

WORKDIR /root

EXPOSE 8080

COPY app/package*.json ./
RUN npm install

COPY app/favicon ./favicon/
COPY app/index.html ./
COPY app/style.css ./
COPY app/client.js ./
COPY app/server.js ./

CMD ["node", "server.js"]
