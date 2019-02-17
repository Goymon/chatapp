const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');
const { APP_PORT, IN_PROD, DB_USERNAME, DB_PASSWORD } = require('./src/config');
const mongoose = require('mongoose');


const express = require('express');
const app = express();


app.disable('x-powered-by');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: IN_PROD
});

server.applyMiddleware({ app });


mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@ds239703.mlab.com:39703/chat`, { useNewUrlParser: true })
    .then(() => {
        app.listen({ port: APP_PORT }, () =>
            console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
        )
    })
    .catch(err => console.log);
