const Joi = require('joi');
const mongoose = require('mongoose');
const { UserInputError } = require('apollo-server-express');
const { signUp, signIn } = require('../schemas');
const { User } = require('../models');
const Auth = require('../auth');

module.exports = {
    Query: {
        me: (root, args, { req }, info) => {
            Auth.checkSignedIn(req);

            return User.findById(req.session.userId);
        },
        users: async (root, args, { req }, info) => {
            // TODO: auth, projection 

            Auth.checkSignedIn(req);

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
        signUp: async (root, args, { req }, info) => {
            // TODO: not auth
            
            Auth.checkSignedOut(req);

            await Joi.validate(args, signUp, { abortEarly: false });
            return User.create(args);
        },
        signIn: async (root, args, { req }, info) => {
            const { userId } = req.session;

            if(userId) {
                return User.findById(userId);
            }

            await Joi.validate(args, signIn, { abortEarly: false });
            
            const user = await Auth.attempSignIn(args.email, args.password);

            req.session.userId = user.id;

            return user;
        },
        signOut: (root, args, { req, res }, info) => {
            Auth.checkSignedIn(req);

            return Auth.signOut(req, res);
        }
    }
}