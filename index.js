const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');
const session = require('express-session');
const connectRedis = require('connect-redis');

const mongoose = require('mongoose');

const { 
    APP_PORT, 
    IN_PROD,
    DB_USERNAME,
    DB_PASSWORD,
    SESS_NAME,
    SESS_SECRET,
    SESS_LIFETIME,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD } = require('./src/config');


const express = require('express');
const app = express();


app.disable('x-powered-by');

const RedisStore = connectRedis(session);

const store = new RedisStore({
    host: REDIS_HOST,
    port: REDIS_PORT,
    pass: REDIS_PASSWORD
})

app.use(session({
    store,
    name: SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: !IN_PROD,
    context: ({ req, res }) => { req, res }
});

server.applyMiddleware({ app });


mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@ds239703.mlab.com:39703/chat`, { useNewUrlParser: true })
    .then(() => {
        app.listen({ port: APP_PORT }, () =>
            console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
        )
    })
    .catch(err => console.log);
