import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  type: { type: String, enum: ['percent', 'fixed'], required: true },       // % hoặc số tiền
  value: { type: Number, required: true, min: 0 },                           // ví dụ 10 (%) hoặc 50000 (₫)
  minOrder: { type: Number, default: 0 },                                    // đơn tối thiểu
  expiresAt: { type: Date },                                                 // hết hạn
  usageLimit: { type: Number, default: 0 },                                  // 0 = không giới hạn
  usedCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },// tắt/mở nhanh
  note: { type: String, trim: true },                                        // mô tả nội bộ
}, { timestamps: true });

export const Coupon = mongoose.model('Coupon', CouponSchema);
