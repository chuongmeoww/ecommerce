 const itemsSchema = new mongoose.Schema({
   name: String,
   slug: { type: String, index: true },
   price: Number,
   salePrice: Number,
   brand: String,
   images: [{ url: String, alt: String }],
   status: { type: String, default: 'active' },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', default: null },
   // ...
 }, { timestamps: true });
