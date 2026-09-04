import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-passwordHash');

    if (!admin) {
      return res.status(401).json({ message: 'Unauthorized: Admin record not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired session' });
  }
};