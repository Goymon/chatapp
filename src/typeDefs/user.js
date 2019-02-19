const { gql } = require('apollo-server-express');

module.exports = gql`
    extend type Query {,
        me: User
        user(id: ID!): User
        users: [User!]!
    }

    extend type Mutation {
        signUp(email: String!, username: String!, name: String!, password: String!): User
        signIn(email: String!, username: String!): User
        signOut: Boolean
    }

    type User {
        id: ID!
        email: String!
        username: String!
        name: String !
        createdAt: String!
    }
`;