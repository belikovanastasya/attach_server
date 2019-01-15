const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectsSchema = new Schema({
  title: {
    type: String, required: true, max: 100, unique: true,
  },
  dateCreate: { type: Date, required: true },
  dataDeadline: { type: Date, required: true },
  dataVotingStart: { type: Date, required: true },
  dataVotingEnd: { type: Date, required: true },
});

// Export the model
module.exports = mongoose.model('Projects', ProjectsSchema);
