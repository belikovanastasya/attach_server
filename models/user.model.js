const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {type: String, required: true, max: 100, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    description: {type: String, required: false, max: 200},
    avatar: {type: String, required: false, max: 200},
    isDesigner: {type: Boolean, required: false, max: 200},
});
// Export the model
module.exports = mongoose.model('User', UserSchema);