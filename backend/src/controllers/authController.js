import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signupAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are strictly required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email address format' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Strict Enforcement: Maximum 5 admins
    const totalAdmins = await Admin.countDocuments();
    if (totalAdmins >= 5) {
      return res.status(403).json({
        message: 'Admin limit reached. Maximum 5 admin accounts are permitted.'
      });
    }

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash
    });

    return res.status(201).json({
      message: 'Admin account created successfully. You can now log in.',
      admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3-Day Persistent Token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    const isCrossSite = process.env.NODE_ENV === 'production' || req.secure;
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: isCrossSite,
      sameSite: isCrossSite ? 'none' : 'lax',
      maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
    });

    return res.status(200).json({
      message: 'Login successful',
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const logoutAdmin = (req, res) => {
  const isCrossSite = process.env.NODE_ENV === 'production' || req.secure;
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: isCrossSite,
    sameSite: isCrossSite ? 'none' : 'lax'
  });
  return res.status(200).json({ message: 'Successfully logged out' });
};

export const getMe = async (req, res) => {
  return res.status(200).json({ admin: req.admin });
};