const mongoose = require('mongoose');
const { UserInputError } = require('apollo-server-express');
const { User } = require('../models');

module.exports = {
    Query: {
        users: async (root, args, context, info) => {
            return await User.find({});
        },
        user: (root, { id }, context, info) => {
            if(!mongoose.Types.ObjectId.isValid(id)) {
                throw new UserInputError('invalid user ID.');
            }
        }
    },
    Mutation: {
        signUp: (root, args, context, info) => {

        }
    }
}