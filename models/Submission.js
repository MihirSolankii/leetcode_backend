import mongoose from "mongoose";

// Schema for test case results
const testCaseResultSchema = new mongoose.Schema({
  testCase: { type: Number, required: true },
  input: { type: mongoose.Schema.Types.Mixed, required: true }, // More flexible types
  expected: { type: mongoose.Schema.Types.Mixed, required: true }, // Flexible for different output types
  actual: { type: mongoose.Schema.Types.Mixed, required: true }, // Flexible actual output
  matched: { type: Boolean, required: true },
});

// Schema for submissions
// const SubmissionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who submitted the solution
//   problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true }, // Problem being solved
//   code: { type: String, required: true }, // User's code
//   status: { 
//     type: String, 
//     required: true, 
//     enum: ['Pending', 'In Progress', 'Completed', 'Failed', 'Compiling'], // More granular status options
//     default: 'Pending',
//   },
//   results: [{
//     testCase: { type: Number },
//     input: { type: mongoose.Schema.Types.Mixed },
//     expected: { type: mongoose.Schema.Types.Mixed },
//     actual: { type: mongoose.Schema.Types.Mixed },
//     matched: { type: Boolean },
//   }],
//   output: { type: String }, // Output from user code execution
//   error: { type: String }, // Error message if any
//   feedback: { type: String }, // Additional feedback (useful for failed submissions)
//   executionTime: { type: Number }, // Execution time (in milliseconds)
//   logs: { type: String }, // Logs from the code execution
//   testCaseResults: [testCaseResultSchema], // Consolidated test case results
//   createdAt: { type: Date, default: Date.now }, // Automatically set creation date
// }, { timestamps: true }); // Adds createdAt and updatedAt automatically

const SubmissionSchema = new mongoose.Schema({
  problem_name: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Accepted", "Runtime Error", "Wrong Answer", "Time Limit Exceeded"], // Allowed values
},
  error: { type: String },
  time: { type: Date, default: Date.now },
  runtime: { type: Number },
  language: { type: String, default: "JavaScript" },
  memory: { type: Number },
  code_body: { type: String },
  input: { type: String },
  expected_output: { type: String },
  user_output: { type: String },
});

// Create and export the Submission model
const Submission = mongoose.model("Submission", SubmissionSchema);
export default Submission;
