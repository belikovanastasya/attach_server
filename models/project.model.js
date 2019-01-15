const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  title: {
    type: String, required: true, max: 100, unique: true,
  },
  dateCreate: { type: Date, required: true },
  dataDeadline: { type: Date, required: true },
  dataVotingStart: { type: Date, required: true },
  dataVotingEnd: { type: Date, required: true },
  works: { type: Array, required: false, max: 200 },
});

// Export the model
module.exports = mongoose.model('Project', ProjectSchema);
