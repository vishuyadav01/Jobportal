import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';

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

  let user = await User.findOne({ email });

  // Master Admin Logic: Auto-create or Auto-elevate admin@gmail.com
  if (email === 'admin@gmail.com' && password === 'Vishu@0109') {
    if (!user) {
      // Create the admin if they don't exist
      user = await User.create({
        name: 'Vishu Admin',
        email: 'admin@gmail.com',
        password: 'Vishu@0109',
        role: 'admin'
      });
    } else if (user.role !== 'admin') {
      // Ensure they have the admin role if they exist but role changed
      user.role = 'admin';
      await user.save();
    }
  }

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
    throw new Error('Please upload a PDF file');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Upload to Cloudinary using stream
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'resumes',
      resource_type: 'raw', // Important for PDF
      public_id: `resume_${user._id}_${Date.now()}`,
      format: 'pdf',
    },
    async (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Cloudinary upload failed', error });
      }

      user.resumeUrl = result.secure_url;
      await user.save();
      res.json({ message: 'Resume uploaded successfully', resumeUrl: result.secure_url });
    }
  );

  uploadStream.end(req.file.buffer);
});
