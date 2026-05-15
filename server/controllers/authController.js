import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import fs from 'fs';

// @desc    Register new user
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'candidate',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('Account not found. Please sign up first.');
  }

  if (await user.comparePassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid password');
  }
});

// @desc    Get user profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      location: updatedUser.location,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      resumeUrl: updatedUser.resumeUrl,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Upload resume (Candidate only)
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please select a PDF file to upload.');
  }

  // 🔎 CRITICAL DEBUG LOGS
  console.log('--- FRONTEND PAYLOAD VERIFICATION ---');
  console.log('Original Name:', req.file.originalname);
  console.log('Mimetype:', req.file.mimetype);
  console.log('Size:', req.file.size, 'bytes');

  // 🧪 LOCAL INTEGRITY TEST
  try {
    fs.writeFileSync('debug.pdf', req.file.buffer);
    console.log('✅ Local file "debug.pdf" saved. OPEN THIS FILE ON YOUR COMPUTER TO TEST.');
  } catch (err) {
    console.error('❌ Could not save debug file:', err);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const cldStream = cloudinary.uploader.upload_stream(
        {
          folder: 'resumes',
          resource_type: 'raw',
          format: 'pdf',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(cldStream);
    });

    user.resumeUrl = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      resumeUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Resume upload failed. Please try again.');
  }
});
