import mongoose from 'mongoose';

const pendingPaymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    amount: { type: Number, required: true },
    routeName: { type: String, required: true },
    salesmanId: { type: String, required: true },
    salesmanName: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, enum: ['pending', 'collected'], default: 'pending' },
    notes: { type: String, default: '' },
    createdAt: { type: String, required: true },
    collectedAt: { type: String },
  },
  { timestamps: true }
);

export const PendingPayment = mongoose.model('PendingPayment', pendingPaymentSchema);
