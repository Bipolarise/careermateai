import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Bearer fasdfsdkfj234324234324

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const authType = authHeader && authHeader.split(' ')[0]; // Bearer:
  const authToken = authHeader && authHeader.split(' ')[1]; // fasdfsdkfj234324234324

  // check is it the right type and is there a token
  if (authType !== 'Bearer' || !authToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // verify the token + get the payload from jwt
    const decodedPayload = jwt.verify(authToken, process.env.JWT_SECRET);
    // so is there a user with this id in the payload
    const user = await User.findById(decodedPayload._id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
