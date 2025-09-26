// import mongoose from 'mongoose';

// export async function connectDB() {
//   const uri = process.env.MONGODB_URI;
//   if (!uri) throw new Error('MONGODB_URI is not set');

//   mongoose.set('strictQuery', true);
//   await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

//   console.log('[db] Connected to', mongoose.connection.name);
// }
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  // Lấy db từ .env DB_NAME, nếu không có thì lấy từ path của URI, cuối cùng fallback 'test'
  let uriDb = null;
  try {
    const u = new URL(uri);
    uriDb = u.pathname?.replace(/^\//, '') || null;
  } catch {}
  const dbName = process.env.DB_NAME || uriDb || 'test';

  await mongoose.connect(uri, { dbName });
  console.log('[db] Connected to', mongoose.connection.name);
}
