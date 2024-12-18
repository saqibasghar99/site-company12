// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    // required: true,
    trim: true,
    lowercase: true, // Automatically convert email to lowercase
  },
  phone: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
  },
  seen: {
    type: Boolean,
    default: false, // Default value is false (unseen)
  },
  seenAt: {
    type: Date, // To store when it was marked as seen
    default: null, // Initially null until it's marked as seen
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
}
);

const FormData = mongoose.model('FormData', UserSchema);
export default FormData;
