import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const registerRouter = Router();

registerRouter.post('/register', authLimiter, authController.register);

registerRouter.post('/login', authLimiter, authController.login);

registerRouter.patch('/onboarding', authMiddleware.isAuthenticated, authController.onboarding);

registerRouter.patch('/profile', authMiddleware.isAuthenticated, authController.updateProfile);

registerRouter.get('/protected', authMiddleware.isAuthenticated, (req, res) => {
  res.json({ message: "I'm returning a user", user: req.user });
});

export default registerRouter;
