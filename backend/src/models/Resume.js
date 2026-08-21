// MODEL: Connect database and define the schema for Resume + business logic related to model
import mongoose from 'mongoose'; // ODM

const resumeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  experiences: {
    type: String,
    required: false,
  },
  skills: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
});

export default mongoose.model('Resume', resumeSchema);
