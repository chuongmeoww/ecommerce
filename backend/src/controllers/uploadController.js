import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' });

    // convert buffer → base64 for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'ecommerce/products',
      overwrite: false,
    });

    return res.json({
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      public_id: result.public_id,
    });
  } catch (e) {
    next(e);
  }
};
