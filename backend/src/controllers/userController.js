import { User } from '../models/User.js';


export const updateMe = async (req, res) => {
const { name, avatarUrl, phone, address, dob, gender } = req.body;
const patch = {};
if (name !== undefined) patch.name = name;
if (avatarUrl !== undefined) patch.avatarUrl = avatarUrl;
if (phone !== undefined) patch.phone = phone;
if (address !== undefined) patch.address = address;
if (dob !== undefined) patch.dob = new Date(dob);
if (gender !== undefined) patch.gender = gender;


const user = await User.findByIdAndUpdate(
req.user.sub,
{ $set: patch },
{ new: true, runValidators: true }
).select('_id name email role status avatarUrl phone address dob gender createdAt');


return res.json({ message: 'Profile updated', user });
};