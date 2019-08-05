import { Schema, model } from 'mongoose';
import { UserInterface } from '../interfaces/UserInterface';

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
},
{
  timestamps: true,
});

const User = model<UserInterface>('User', UserSchema);

export default User;
