import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false
    },
    mobile: {
      type: String,
      trim: true
    },
    college: {
      type: String,
      trim: true
    },
    branch: {
      type: String,
      trim: true
    },
    graduationYear: {
      type: String,
      trim: true
    },
    skills: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    lastLogin: {
      type: Date,
      default: null
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;
