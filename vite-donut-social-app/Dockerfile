FROM node:alpine
COPY . /frontend
WORKDIR /frontend
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev"]