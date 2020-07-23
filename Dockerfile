FROM node:10
MAINTAINER Sabousian <mohammad.s@videoboom>
WORKDIR /home/nodejs/app
COPY package.json .
RUN npm install 
COPY . .
EXPOSE 3000
CMD ["npm","start"]
