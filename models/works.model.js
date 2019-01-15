const mongoose = require('mongoose');

const { Schema } = mongoose;

const WorksSchema = new Schema({
  name: {
    type: String, required: true, max: 100, unique: true,
  },
  images: { type: String, required: false },
  dataDeadline: { type: Object, required: false },
  description: { type: String, required: false },
  vots: { type: Number, required: false },
});

// Export the model
module.exports = mongoose.model('Works', WorksSchema);
