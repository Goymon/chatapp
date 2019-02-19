const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { hash, compare } = require('bcryptjs');

const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: async email => await User.doesntExist({ email }),
            message: ({ value }) => `Email ${ value } has already been taken.`
            // TODO: security
        }
    },
    username: {
        type: String,
        validate: {
            validator: async username => await User.doesntExist({ username }),
            message: ({ value }) => `Username ${ value } has already been taken.`
            // TODO: security
        }
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        this.password =  await hash(this.password, 12);
    }
});

userSchema.statics.doesntExist = async function(options) {
    return await this.where(options).countDocuments() === 0;
}

userSchema.methods.matchesPassword = function(password) {
    return compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User; 