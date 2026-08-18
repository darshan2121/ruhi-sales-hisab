import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    expectedCollection: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Route = mongoose.model('Route', routeSchema);
