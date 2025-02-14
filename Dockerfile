FROM node:20-alpine

WORKDIR /app

COPY package.json  package-lock.json  tsconfig.json  nodemon.json atphotobackend-b9d66802c105.json  ./

RUN npm install

COPY src ./src

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]