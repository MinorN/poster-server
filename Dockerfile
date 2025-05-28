FROM node:22-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --registry=https://registry.npmmirror.com/
COPY . /usr/src/app
RUN npm run tsc
EXPOSE 7001
CMD npx egg-scripts start --title=poster-backend