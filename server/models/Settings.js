import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: 'Ruhi Sales' },
    subtitle: { type: String, default: 'Authorized Distributor - Namkeen & Foods' },
    defaultProfitPct: { type: Number, default: 7 },
    allowSalesmanProfitOverride: { type: Boolean, default: true },
    language: { type: String, default: 'gu' },
    adminPin: { type: String, default: '1234' },
  },
  { timestamps: true }
);

export const Settings = mongoose.model('Settings', settingsSchema);
