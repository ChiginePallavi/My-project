import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    status: {
      type: String,
      default: 'Open',
      trim: true
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    deadline: {
      type: String,
      required: [true, 'Deadline is required'],
      trim: true
    },
    package: {
      type: String,
      required: [true, 'Package is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

opportunitySchema.index({ title: 'text', company: 'text', description: 'text', category: 'text' });

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity;
