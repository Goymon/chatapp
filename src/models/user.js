const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { hash } = require('bcryptjs');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
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

module.exports = mongoose.model('User', userSchema)