



import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
name: { type: String, trim: true },
email: { type: String, required: true, unique: true, lowercase: true, trim: true },
passwordHash: { type: String, required: true },
role: { type: String, enum: ['user','admin'], default: 'user' },
status: { type: String, enum: ['active','blocked'], default: 'active' },


// 🔽 New optional profile fields
avatarUrl: { type: String },
phone: { type: String, trim: true },
address: { type: String, trim: true },
dob: { type: Date },
gender: { type: String, enum: ['male','female','other'], default: undefined },


resetPasswordToken: String,
resetPasswordExpires: Date
}, { timestamps: true });


userSchema.methods.comparePassword = function (plain) {
return bcrypt.compare(plain, this.passwordHash);
};


export const User = mongoose.model('User', userSchema);