FROM node:6.9.1
ENV PROJECT_NAME blog
MAINTAINER ioopsd, ioopsd.cn@gmail.com 
# https://yarnpkg.com/en/docs/install
RUN apt-key adv --keyserver pgp.mit.edu --recv D101F7899D41F3C3
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update \
    && apt-get install git-core yarn \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir /app \
    && mkdir -p /var/log/blog/
WORKDIR /app

RUN rm -rf node_modules
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn
#  @types/mongodb @types/connect-mongo @types/bunyan
#  @types/express @types/joi @types/redis @types/request @types/form-data \
#  @types/ua-parser-js @types/lodash @types/node @types/chalk @types/passport \
#  @types/passport-local @types/glob @types/minimatch @types/serve-static @types/mime \
#  @types/express-serve-static-core @types/nodemailer
# Make everything available for start
COPY . /app
# Port 8001 for web server
# Port 35729 for livereload
EXPOSE 3000
ENV NODE_ENV production
# TODO Perhaps we can optimize it and move it before COPY . /app
#      and add only those files that are really needed.
CMD yarn start:prod