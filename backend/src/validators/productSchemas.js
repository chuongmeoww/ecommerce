// import { z } from 'zod';

// export const createProductSchema = z.object({
//   name: z.string().min(2),
//   slug: z.string().min(2).optional(),
//   description: z.string().max(5000).optional(),
//   images: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).optional(),
//   price: z.coerce.number().min(0),
//   salePrice: z.coerce.number().min(0).optional().nullable(),
//   category: z.string().optional(),
//   brand: z.string().optional(),
//   stock: z.coerce.number().int().min(0).optional(),
//   status: z.enum(['active', 'draft', 'archived']).optional(),
//   colors: z.array(z.string()).optional(),
//   sizes: z.array(z.string()).optional(),
//   sku: z.string().optional()
// });
// export const updateProductSchema = createProductSchema.partial();


// backend/src/validators/productSchemas.js
import { z } from 'zod';

// ObjectId 24 hex
export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const imageSchema = z.object({
  url: z.string().url('Invalid image url'),
  alt: z.string().optional()
});

const baseProduct = {
  name: z.string().min(1),
  slug: z.string().min(1).optional(), // nếu không gửi sẽ tự tạo từ name
  description: z.string().optional(),
  images: z.array(imageSchema).default([]),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  sku: z.string().optional()
};

export const createProductSchema = z.object(baseProduct).refine(
  (d) => d.salePrice == null || d.salePrice <= d.price,
  { message: 'salePrice must be <= price', path: ['salePrice'] }
);

export const updateProductSchema = z.object({
  ...Object.fromEntries(Object.entries(baseProduct).map(([k, v]) => [k, v.optional()])),
}).refine(
  (d) => d.salePrice == null || d.price == null || d.salePrice <= d.price,
  { message: 'salePrice must be <= price', path: ['salePrice'] }
);

export const setStatusSchema = z.object({
  status: z.enum(['active', 'draft', 'archived'])
});

export const patchStockSchema = z.object({
  // hoặc gửi delta để +/-, hoặc gửi stock để set tuyệt đối
  delta: z.number().int().optional(),
  stock: z.number().int().min(0).optional()
}).refine((d) => d.delta != null || d.stock != null, {
  message: 'Provide either delta or stock'
});

export const bulkStatusSchema = z.object({
  ids: z.array(objectId).min(1),
  status: z.enum(['active', 'draft', 'archived'])
});

export const bulkDeleteSchema = z.object({
  ids: z.array(objectId).min(1)
});
