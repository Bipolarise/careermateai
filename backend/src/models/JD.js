// MODEL: Connect database and define the schema for JD (Job Description) + business logic related to model
import mongoose from 'mongoose'; // ODM

const jdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    generatedResume: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('JD', jdSchema);
