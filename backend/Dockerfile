FROM node:20-alpine3.20

WORKDIR /app
COPY . .
RUN npm install 

COPY src ./src

CMD ["npx", "ts-node", "src/index.ts"]
