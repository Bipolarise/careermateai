import * as authServices from '../services/authServices.js';

export const register = async (req, res, next) => {
  try {
    const user = await authServices.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Implement your login logic here
    // For example, find the user by email and compare the password
    const user = await authServices.loginUser(email, password);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const onboarding = async (req, res, next) => {
  try {
    const { role, field, goal } = req.body;
    const user = await authServices.completeOnboarding(req.user._id, { role, field, goal });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, role, field, goal } = req.body;
    const user = await authServices.updateProfile(req.user._id, { fullName, role, field, goal });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
