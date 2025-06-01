// import User from "../models/User.js";
import { User, Admin } from "../models/User.js"; // Importing User and Admin models
import jwt from "jsonwebtoken";
import bcrypt  from "bcryptjs"
import dotenv from "dotenv";


dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};



export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user (either a regular user or admin based on email)
    const user = await User.findOne({ email }) || await Admin.findOne({ email });
    
    // If no user or admin found
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = generateToken(user._id);

    // Return the response with token and user details
    res.json({
      success: true,
      token,
      userId: user._id,
      message: 'Login successful',
      role: user.role,  // Include the role in the response to distinguish between user and admin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Register
export const registerUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body; // Use `isAdmin` or other criteria to determine the role

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      password: hashedPassword,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    };

    // Create the user or admin based on the role
    const newUser = isAdmin ? new Admin(userData) : new User({ ...userData, potdStreak: 0 });
    await newUser.save();

    // Generate a JWT token (assuming a `generateToken` function)
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      userId: newUser._id,
      message: 'User created successfully',
      newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserById = async (req, res) => {
  const { userId } = req.params;
  
  // Validate userId
  if (!userId || userId === 'null' || userId === 'undefined') {
    console.log('Invalid userId received:', userId);
    return res.status(400).json({ message: 'Invalid user ID provided' });
  }

  console.log('Received userId:', userId);
  console.log('userId length:', userId?.length);
  console.log('userId type:', typeof userId);
  // Check if userId is a valid MongoDB ObjectId
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    console.log('Invalid userId format:', userId);
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
