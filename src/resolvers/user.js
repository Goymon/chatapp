const Joi = require('joi');
const mongoose = require('mongoose');
const { UserInputError } = require('apollo-server-express');
const { SignUp } = require('../schemas');
const { User } = require('../models');

module.exports = {
    Query: {
        users: async (root, args, context, info) => {
            // TODO: auth, projection 

            return await User.find({});
        },
        user: (root, { id }, context, info) => {
            // TODO: auth, projection, sanitation

            if(!mongoose.Types.ObjectId.isValid(id)) {
                throw new UserInputError('invalid user ID.');
            }

            return User.findById(id);
        }
    },
    Mutation: {
        signUp: async (root, args, context, info) => {
            // TODO: not auth
            // TODO: validation
            await Joi.validate(args, SignUp, { abortEarly: false });
            return User.create(args);
        }
    }
}