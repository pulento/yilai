# Run: docker run -it --net=host -d pulento/yilai
# User --net=host since we need multicast
FROM node:8-alpine

# Create app directory
WORKDIR /usr/src/app

# Install Git
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./

RUN git clone --recursive https://github.com/pulento/yilai.git .

RUN npm install
# Ugly hack because previous npm install transform yeelight-wifi in a symlink
RUN rm node_modules/yeelight-wifi && git submodule update --init

RUN cd node_modules/yeelight-wifi && npm run build

RUN npm run postinstall

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
#COPY . .

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
