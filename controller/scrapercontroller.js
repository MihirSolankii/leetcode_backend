import Problem from "../models/problem.js";
 import { User, Admin } from "../models/User.js"; // Import User and Admin models
// import User from "../models/User.js";

// Function to create a problem with manually added test cases
const createProblem = async (req, res) => {
  const {
    title,
    description,
    starter_code,
    difficulty,
    examples,
    topics,
    solution,
    testCases // Added testCases to the request body
  } = req.body; // Get problem details from request body
  const userId = req.user.id; // Get user ID from request object

  // Check if the user is an admin
  const user = await User.findById(userId) || await Admin.findById(userId);
  if (!user || user.role !== 'Admin') {
    return res.status(403).json({ error: "Access denied. Only admins can create problems." });
  }

  // Validate inputs
  if (!title || !description || !difficulty || !Array.isArray(topics) || topics.length === 0 || !Array.isArray(testCases)) {
    return res.status(400).json({ error: "All fields are required, and topics and testCases must be non-empty arrays." });
  }

  try {
    // Validate the test case format
    testCases.forEach((testCase, index) => {
      // Check if 'input' and 'expectedOutput' exist and are either strings or arrays
      if (!testCase.input || (!Array.isArray(testCase.input) && typeof testCase.input !== 'string')) {
        throw new Error(`Invalid 'input' format at index ${index}. It must be either a string or an array.`);
      }

      if (!testCase.expectedOutput || 
          (!Array.isArray(testCase.expectedOutput) && typeof testCase.expectedOutput !== 'string')) {
        throw new Error(`Invalid 'expectedOutput' format at index ${index}. It must be either a string or an array.`);
      }

      // Check that input and expectedOutput are of the same type (both string or both array)
      if (Array.isArray(testCase.input) !== Array.isArray(testCase.expectedOutput)) {
        throw new Error(`Input and expectedOutput must both be of the same type at index ${index}.`);
      }

      // Additional check for array-based test cases (if applicable)
      if (Array.isArray(testCase.input)) {
        if (!testCase.input.every(item => typeof item === 'number')) {
          throw new Error(`Array 'input' must contain only numbers at index ${index}.`);
        }
        if (!testCase.expectedOutput.every(item => typeof item === 'number')) {
          throw new Error(`Array 'expectedOutput' must contain only numbers at index ${index}.`);
        }
      }
    });

    // Create a new problem instance with the admin's user ID
    const newProblem = new Problem({
      title,
      description,
      starterCode: starter_code,
      difficulty,
      examples, // Expecting examples as an array of example inputs/outputs
      topics,
      user: userId, // Associate problem with the admin who created it
      testCases, // Store the manually provided test cases
      solution // Expecting the solution as a string or code snippet
    });

    await newProblem.save(); // Save problem to the database

    // Add the problem to the admin's problems list
    user.problems.push(newProblem);
    await user.save();

    res.json({
      message: "Problem successfully created and saved!",
      problem: newProblem,
    });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ error: "Failed to save the problem to the database." });
  }
};

export default createProblem;
