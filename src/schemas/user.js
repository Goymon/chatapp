const Joi = require('joi');

const email = Joi.string().email().required().label('Email');
const username = Joi.string().alphanum().min(4).max(30).required().label('Username');
const name = Joi.string().max(254).required().label('Name');
const password = Joi.string().min(8).max(50).regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/)
    .label('Password').options({
        language: {
            string: {
                regex: {
                    base: 'Password must contain one lowercase one uppercase letter one digit'
                }
            }
        }
    });

module.exports.signUp = Joi.object().keys({
    email, username, name, password
});

module.exports.signIn = Joi.object().keys({
    email, password
});