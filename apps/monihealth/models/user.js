var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    age: Number,
    phone: String
});

module.exports = mongoose.model('users', UserSchema);