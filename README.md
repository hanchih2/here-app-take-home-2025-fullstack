clone the repository

```
git clone https://github.com/hanchih2/here-app-take-home-2025-fullstack.git
cd here-app-take-home-2025-fullstack
```

## Run the Server

install dependencies

```
cd server
npm install
```

the server should run on port 4000

```
npm start
```

### Run Test

unit test

```
npm run test:unit
```

functional test (require docker to mock database)

````
docker run -d --rm --name test-mongo -p 27017:27017 mongo:4.4
npm run test:func
````

cleanup container and image

```
docker stop test-mongo
docker rmi mongo:4.4
```

## Run the Client

install dependencies

```
cd .. // if you are in server directory
cd client
npm install
```

start the client

```
npm start
```
