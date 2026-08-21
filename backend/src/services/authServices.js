import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { hashForLookup } from '../utils/encryption.js';
import emailServices from './emailServices.js';

export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ emailHash: hashForLookup(userData.email) });

  if (existingUser) {
    throw new Error('User already exists');
  }
  const newUser = new User({
    fullName: userData.name,
    email: userData.email,
    password: userData.password,
  });

  emailServices.emailSenderTemplate(
    userData.email,
    { fullName: userData.name },
    'contactPageEmailTemplate',
    (err, data) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent successfully:', data);
      }
    },
  );

  await newUser.save();
  // 4. return the new user
  return newUser;
};

export const updateUser = async (userId, updateData) => {
  // 1. find the user by id
  const user = await User.findById(userId);
  // 2. if user does not exist, throw error
  if (!user) {
    throw new Error('User not found');
  }
  // 3. update the user with the new data
  Object.assign(user, updateData);
  await user.save();
  // 4. return the updated user
  return user;
};

export const updateProfile = async (userId, { fullName, role, field, goal }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // email is intentionally not accepted here — it's read-only from the settings page
  if (fullName !== undefined) user.fullName = fullName;
  if (role !== undefined) user.role = role;
  if (field !== undefined) user.field = field;
  if (goal !== undefined) user.goal = goal;

  // regenerate the token so the JWT (and every page reading it) reflects the edit immediately
  const userWithToken = await user.generateAuthToken();
  return userWithToken;
};

export const completeOnboarding = async (userId, { role, field, goal }) => {
  if (!role || !field || !goal) {
    throw new Error('role, field and goal are all required');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.role = role;
  user.field = field;
  user.goal = goal;

  // regenerate the token so the JWT (and dashboard, which reads it) has the latest onboarding info
  const userWithToken = await user.generateAuthToken();
  return userWithToken;
};

export const loginUser = async (email, password) => {
  // find the user by email (via the deterministic blind index, since the stored email is encrypted)
  const user = await User.findOne({ emailHash: hashForLookup(email) });
  // if user does not exist, throw error
  if (!user) {
    throw new Error('User not found');
  }
  // compare the user input password and hashed password
  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    throw new Error('Invalid password');
  }

  const userWithToken = await user.generateAuthToken();
  return userWithToken;
};
