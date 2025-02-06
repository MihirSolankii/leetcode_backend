import jwt from "jsonwebtoken";
import { User, Admin } from "../models/User.js"; // Import both User and Admin models
// import User from "../models/User.js";

// Middleware to authenticate the user
const authMiddleware = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token and attach the decoded user info to the request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging: Log the decoded token

    // Attach user info (id and role) to the request object
    req.user = { id: decoded.id, role: decoded.role };  // Assuming your JWT includes a `role` field
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("JWT Error:", error); // Log the error for debugging
    return res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = async (req, res, next) => {
  try {
    // Log the user ID extracted from the token
    console.log("User ID from token:", req.user.id);

    // Find the user by ID from the decoded token (BaseUser model handles both User and Admin)
    const user = await User.findById(req.user.id) || await Admin.findById(req.user.id);

    console.log("User found in database:", user); // Debugging: Log the found user

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user has admin privileges
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("isAdmin Error:", error); // Log the error for debugging
    return res.status(500).json({ message: "Server error." });
  }
};

export default authMiddleware;
