import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// Define the photo schema
const photoSchema = new mongoose.Schema({
  url: { type: String, required: false },
  id: { type: String, required: false },
});

const PostSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  active: { type: Boolean, required: true, default: true },
  streetAddress: { type: String, required: false },
  unitNo: { type: String, required: false },
  city: { type: String, required: false },
  stateCode: { type: String, required: false },
  zipCode: { type: String, required: false },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  phoneNumber: { type: String, required: false },
  startDateRange: { type: Date, required: false },
  endDateRange: { type: Date, required: false },
  price: { type: Number, required: false },
  bedCount: { type: Number, required: false },
  bathCount: { type: Number, required: false },
  numberOfSpots: { type: Number, required: false },
  nearbyPlaces: { type: String, required: false },
  homeType: { type: String, required: false },
  utilities: { type: [String], required: false },
  amenities: { type: [String], required: false },
  foodPreference: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  approved: { type: Boolean, required: false, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: false },
  approvedAt: { type: Date, required: false },
  photos: [photoSchema],
  createdAt: { type: Date, required: true, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
