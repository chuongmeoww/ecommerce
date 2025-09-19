// // backend/src/models/Order.js
// import mongoose from 'mongoose';

// const OrderItemSchema = new mongoose.Schema(
//   {
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//     name: String,
//     slug: String,
//     image: String,
//     price: { type: Number, required: true },
//     qty: { type: Number, required: true, min: 1 },
//     size: String,
//     color: String,
//     sku: String,
//   },
//   { _id: false }
// );

// const AddressSchema = new mongoose.Schema(
//   {
//     fullName: String,
//     phone: String,
//     address: String,
//     ward: String,
//     district: String,
//     province: String,
//   },
//   { _id: false }
// );

// const TimelineSchema = new mongoose.Schema(
//   { at: { type: Date, default: Date.now }, status: String, note: String },
//   { _id: false }
// );

// const OrderSchema = new mongoose.Schema(
//   {
//     code: { type: String, index: true }, // ví dụ ODR20250919-001
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },

//     items: { type: [OrderItemSchema], required: true },
//     subtotal: { type: Number, required: true },
//     discount: { type: Number, default: 0 },
//     total: { type: Number, required: true },

//     couponCode: String,

//     shippingAddress: { type: AddressSchema, required: true },
//     note: String,

//     status: {
//       type: String,
//       enum: ['pending', 'confirmed', 'shipping', 'completed', 'canceled'],
//       default: 'pending',
//       index: true
//     },

//     timeline: { type: [TimelineSchema], default: [] },
//   },
//   { timestamps: true }
// );

// export const Order = mongoose.model('Order', OrderSchema);
// backend/src/models/Order.js
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  name: String,
  sku: String,
  color: String,
  size: String,
  price: { type: Number, required: true }, // đơn giá đã chốt
  qty: { type: Number, required: true },
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  line1: String,
  line2: String,
  ward: String,
  district: String,
  city: String,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  code: { type: String, unique: true, index: true }, // vd: OD20250001
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  items: { type: [OrderItemSchema], required: true },
  note: String,

  shippingAddress: AddressSchema,
  paymentMethod: { type: String, enum: ['cod', 'bank', 'momo', 'vnpay'], default: 'cod' },

  subtotal: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },

  status: { 
    type: String, 
    enum: ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'], 
    default: 'pending', 
    index: true 
  },
  paid: { type: Boolean, default: false },

  // log mốc thời gian
  placedAt: Date,
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  refundedAt: Date,
}, { timestamps: true });

export const Order = mongoose.model('Order', OrderSchema);
