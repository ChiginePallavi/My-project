import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';

const SALT_ROUNDS = 10;
const uploadDir = path.resolve('uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const buildPublicUrl = (fileName) => `/uploads/${fileName}`;

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, mobile, college, branch, graduationYear, skills, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const profileImage = req.file ? buildPublicUrl(req.file.filename) : '';
    const userRole = role === 'admin' ? 'admin' : 'student';

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      mobile: mobile?.trim() || '',
      college: college?.trim() || '',
      branch: branch?.trim() || '',
      graduationYear: graduationYear?.trim() || '',
      skills: skills?.trim() || '',
      profileImage,
      role: userRole
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        mobile: user.mobile,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        skills: user.skills
      }
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        mobile: user.mobile,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        skills: user.skills,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        mobile: user.mobile,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        skills: user.skills,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, mobile, college, branch, graduationYear, skills } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (mobile !== undefined) user.mobile = mobile.trim();
    if (college !== undefined) user.college = college.trim();
    if (branch !== undefined) user.branch = branch.trim();
    if (graduationYear !== undefined) user.graduationYear = graduationYear.trim();
    if (skills !== undefined) user.skills = skills.trim();

    if (req.file) {
      user.profileImage = buildPublicUrl(req.file.filename);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        mobile: user.mobile,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        skills: user.skills,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};
