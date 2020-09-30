FROM node:12
WORKDIR /home/app/api

ENV PATH /home/app/api/node_modules/.bin:$PATH


COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
EXPOSE 3001

CMD [ "node", "dist/index.js" ]