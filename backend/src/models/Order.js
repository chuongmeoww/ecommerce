// backend/src/models/Order.js
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    slug: String,
    image: String,
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    size: String,
    color: String,
    sku: String,
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    address: String,
    ward: String,
    district: String,
    province: String,
  },
  { _id: false }
);

const TimelineSchema = new mongoose.Schema(
  { at: { type: Date, default: Date.now }, status: String, note: String },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    code: { type: String, index: true }, // ví dụ ODR20250919-001
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },

    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    couponCode: String,

    shippingAddress: { type: AddressSchema, required: true },
    note: String,

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'completed', 'canceled'],
      default: 'pending',
      index: true
    },

    timeline: { type: [TimelineSchema], default: [] },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', OrderSchema);
