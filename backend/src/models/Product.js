
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
  { url: { type: String, required: true }, alt: String },
  { _id: false }
);

const VariantSchema = new mongoose.Schema(
  {
    sku: { type: String, trim: true },
    size: { type: String, trim: true },       // S, M, L, XL...
    color: { type: String, trim: true },      // tên hoặc mã màu
    stock: { type: Number, default: 0 },      // tồn kho biến thể
    price: { type: Number },                  // override (tuỳ chọn)
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, trim: true, default: 'Generic' },

    description: { type: String, default: '' },
    specs: { type: [String], default: [] },                // thông số/bảo quản

    price: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },               // 0 = không giảm

    category: { type: String, index: true },               // slug, vd: 'ao-thun'
    collection: { type: String, index: true },             // slug, vd: 'the-beginner'
    tags: { type: [String], index: true, default: [] },

    images: { type: [ImageSchema], default: [] },

    variants: { type: [VariantSchema], default: [] },      // size/màu/sku/stock
    stock: { type: Number, default: 0 },                   // tổng tồn (nếu không dùng variants)
    sold: { type: Number, default: 0, index: true },

    ratingAvg: { type: Number, default: 0, min: 0, max: 5, index: true },
    ratingCount: { type: Number, default: 0 },

    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active', index: true },
    featured: { type: Boolean, default: false, index: true },

    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

// computed virtual (in-stock)
ProductSchema.virtual('inStock').get(function () {
  if (this.variants?.length) {
    return this.variants.some(v => (v.stock || 0) > 0);
  }
  return (this.stock || 0) > 0;
});

// text index cho tìm kiếm “q”
ProductSchema.index({
  name: 'text',
  brand: 'text',
  description: 'text',
  tags: 'text',
});

export const Product = mongoose.model('Product', ProductSchema);
