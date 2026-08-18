import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    timestamp: { type: String, required: true },
    editedBy: { type: String, required: true },
    oldTotal: Number,
    newTotal: Number,
    oldCash: Number,
    newCash: Number,
    oldOnline: Number,
    newOnline: Number,
    reason: String,
  },
  { _id: false }
);

const hisabEntrySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    salesmanId: { type: String, required: true },
    salesmanName: { type: String, required: true },
    routeId: { type: String, required: true },
    routeName: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    cashBreakdown: { type: Object, required: true },
    cashAmount: { type: Number, required: true },
    onlineAmount: { type: Number, required: true },
    onlineMode: { type: String, default: 'UPI' },
    totalAmount: { type: Number, required: true },
    profitPct: { type: Number, required: true },
    profitAmount: { type: Number, required: true },
    expectedCollection: { type: Number, required: true },
    difference: { type: Number, required: true },
    status: { type: String, enum: ['submitted', 'synced_offline'], default: 'submitted' },
    auditLogs: [auditLogSchema],
  },
  { timestamps: true }
);

export const HisabEntry = mongoose.model('HisabEntry', hisabEntrySchema);
