// import Category from '../models/Category.js';

// export const listCategories = async (req, res) => {
//   const categories = await Category.find().lean();
//   res.json({ categories });
// };

// export const getCategoryBySlug = async (req, res) => {
//   const { slug } = req.params;
//   const cat = await Category.findOne({ slug }).lean();
//   if (!cat) return res.status(404).json({ message: 'Category not found' });
//   res.json({ category: cat });
// };

// // (Tuỳ chọn) Admin create/update
// export const createCategory = async (req, res) => {
//   const cat = await Category.create(req.body);
//   res.status(201).json({ category: cat });
// };

// export const updateCategory = async (req, res) => {
//   const { id } = req.params;
//   const cat = await Category.findByIdAndUpdate(id, req.body, { new: true });
//   if (!cat) return res.status(404).json({ message: 'Category not found' });
//   res.json({ category: cat });
// };


// backend/src/controllers/categoryController.js
import { Category } from '../models/Category.js';
import { slugify } from '../utils/slugify.js';

// Public: chỉ lấy active, sắp xếp theo order rồi name
export const listCategories = async (req, res) => {
  const categories = await Category.find({ active: true })
    .sort({ order: 1, name: 1 })
    .lean();
  res.json({ categories });
};

export const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  const cat = await Category.findOne({ slug, active: true }).lean();
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json({ category: cat });
};

// Admin
export const adminListCategories = async (req, res) => {
  const categories = await Category.find({}).sort({ order: 1, name: 1 }).lean();
  res.json({ categories });
};

export const createCategory = async (req, res) => {
  const { name, slug, image, description, order, active } = req.body || {};
  const s = slugify(slug || name);
  const exists = await Category.findOne({ slug: s });
  if (exists) return res.status(409).json({ code: 'SLUG_TAKEN', message: 'Slug exists' });
  const cat = await Category.create({ name, slug: s, image, description, order, active });
  res.status(201).json({ category: cat });
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const patch = { ...req.body };
  if (patch.slug) patch.slug = slugify(patch.slug);
  const cat = await Category.findByIdAndUpdate(id, { $set: patch }, { new: true });
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json({ category: cat });
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const cat = await Category.findByIdAndDelete(id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Deleted' });
};
