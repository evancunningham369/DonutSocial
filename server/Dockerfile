FROM node:alpine
COPY . /backend
WORKDIR /backend
RUN npm install
EXPOSE 3001
CMD ["node", "index"]