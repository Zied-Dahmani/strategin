import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  salt: { type: String, select: false }
});

export const User = mongoose.model('User', UserSchema);

export const getUsers = () => User.find();
export const getUserByEmail = (email: string) => User.findOne({ email });
export const createUser = (values: Record<string, any>) => new User(values).save().then((user) => user.toObject());
  