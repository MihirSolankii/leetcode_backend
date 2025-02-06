// controllers/problemController.js
 // Import the Problem model
import ProblemModel  from '../models/problem.js';
 import {User,Admin} from "../models/User.js";
// import User from "../models/User.js";
// Controller to fetch problems by userId
export const getProblemsByUser = async (req, res) => {
  try {
    // Fetch all problems created by admin users
    const problems = await ProblemModel.find({
      user: { $in: [...await User.find().select('_id'), ...await Admin.find().select('_id')] }
  })
  .populate('user', '_id role'); // Assuming 'role' is a field in User and Admin models
  
  // Now each problem will include user details (like the admin ID or user role)
  console.log(problems);
  

    if (problems.length === 0) {
      return res.status(404).json({ message: 'No problems found.' });
    }

    res.json({ success: true, problems });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// controllers/problemController.js

export const getProblemById = async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  res.json({ problem });
}
// Controller to fetch and return a random problem for a specific user


// Controller to fetch and return a random problem for a specific user
 export const getRandomProblemByUser = async (req, res) => {
  try {
    // Ensure userId is properly formatted
    const userId = req.params.userId.trim();

    // Validate the ObjectId format before querying
     

    // Fetch problems associated with the user
    const problems = await Problem.find({ user: userId });

    if (problems.length === 0) {
      return res.status(404).json({ message: 'No problems found for this user.' });
    }

    // Select a random problem
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];

    res.json({ success: true, problem: randomProblem });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Server error' });
  }
};






 


