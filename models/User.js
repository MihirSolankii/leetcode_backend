import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const baseOptions = {
  discriminatorKey: 'role',
  collection: 'users',
};

const SubmissionSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ["Accepted", "Runtime Error", "Wrong Answer", "Time Limit Exceeded"], // Enforce allowed values
},
problem_name: { type: String, required: true },
error: { type: String },
time: { type: Date, default: Date.now },
runtime: { type: Number },
language: { type: String },
memory: { type: Number },
code_body: { type: String },
input: { type: String },
expected_output: { type: String },
user_output: { type: String },
});

const BaseUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
  },
  baseOptions
);
const submissionSchema = new mongoose.Schema({
  problem_name: String,
  status: String,
  error: String,
  time: Date,
  runtime: String,
  language: String,
  memory: Number,
  code_body: String,
  input: String,
  expected_output: String,
  user_output: String
});

const UserSchema = new mongoose.Schema({
  potdStreak: { type: Number, default: 0 },
  problems_solved: { type: [String], default: [] },
  problems_attempted: { type: [String], default: [] },
  problems_solved_count: { type: Number, default: 0 },
  submissions: [submissionSchema],
  dailyStreaks: [
    { date: { type: Date, required: true }, streak: { type: Number, required: true } },
  ], // Store daily streaks with date
 
});

const AdminSchema = new mongoose.Schema({
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
});

BaseUserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const BaseUser = mongoose.model("BaseUser", BaseUserSchema);
const User = BaseUser.discriminator("User", UserSchema);
const Admin = BaseUser.discriminator("Admin", AdminSchema);

export { User, Admin };






// const UserSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     problems_solved: { type: [String], default: [] }, // List of problem names solved
//     problems_attempted: { type: [String], default: [] }, // List of problem names attempted
//     problems_solved_count: { type: Number, default: 0 }, // Count of problems solved
//     submissions: { type: [SubmissionSchema], default: [] }, // List of user submissions
// });






