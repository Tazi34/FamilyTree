FROM node:13.12.0-alpine

# set working directory
WORKDIR /app


RUN pwd
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY ./FamilyTree/ClientApp/package.json ./
COPY ./FamilyTree/ClientApp/package-lock.json ./
RUN npm install 
RUN npm install react-scripts@3.4.1 -g 

# add app
COPY ./FamilyTree/ClientApp/ ./
EXPOSE 3000
# start app
CMD ["npm", "start"]
