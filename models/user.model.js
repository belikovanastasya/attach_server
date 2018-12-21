const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {type: String, required: true, max: 100, unique: true},
    password: {type: String, required: true},
    firstname: {type: String, required: false},
    secondname: {type: String, required: false},
    about: {type: String, required: false, max: 200},
    photo: {type: String, required: false, max: 200},
});
// Export the model
module.exports = mongoose.model('User', UserSchema);