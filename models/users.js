import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let userSchema = new Schema({
    first: {type: String, required: true},
    last: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    createdOn: {type: Date, default: Date.now},
    isActive: {type: Boolean, default: true},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
