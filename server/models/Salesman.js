import mongoose from 'mongoose';

const salesmanSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    employeeId: { type: String, required: true },
    routeId: { type: String, required: true },
    customProfitPct: { type: Number },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    pin: { type: String, default: '1234' },
  },
  { timestamps: true }
);

export const Salesman = mongoose.model('Salesman', salesmanSchema);
