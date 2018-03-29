FROM node:9.10.0-alpine

WORKDIR /root

EXPOSE 8080

COPY package*.json ./
RUN npm install

COPY favicon ./favicon/
COPY index.html ./
COPY style.css ./
COPY client.js ./
COPY server.js ./

CMD ["node", "server.js"]
