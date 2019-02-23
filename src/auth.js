const { User } = require('./models');
const { AuthenticationError } = require('apollo-server-express');
const { SESS_NAME } = require('./config');

const signedIn = req => req.session.userId;

module.exports.checkSignedIn = req => {
    if(!signedIn(req)) {
        throw new AuthenticationError('You must be signed in.');
    }
}

module.exports.checkSignedOut = req => {
    if(signedIn(req)) {
        throw new AuthenticationError('You are already signed in.');
    }
}

module.exports.attempSignIn = async (email, password) => {
    const user =  await User.findOne({ email });
    const message = 'Incorrect email or password. Please try again.';
    if(!user || !await user.matchesPassword(password)) {
        throw new AuthenticationError(message);
    }

    return user;
}

module.exports.signOut = (req, res) => new Promise(
    (resolve, reject) => {
        req.session.destroy(err => {
            if(err) reject(err);

            res.clearCookie(SESS_NAME);

            resolve(true);
        });
    }
)

