
import express from "express";

const solutionRouter = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";



import { writeTestFile } from "../utils/createTest.js";
import ProblemModel from "../models/problem.js";
// import User from "../models/User.js";
import { User } from "../models/User.js";
import {SolutionController} from "../controller/solutioncontroller.js"

// import submissioncontroller from "../controller/submissioncontroller.js"; // Import the solution controller

// solutionRouter.post("/submit/:name",async (req, res) => {
//     const { name } = req.params;
//     const { id, problem_name, code } = req.body;

//     try {
//         const problem = await ProblemModel.findOne({ "main.name": name });
//         const user = await User.findById(id);

//         if (!user) {
//             res.json([
//                 {
//                     problem_name,
//                     status: "Runtime Error",
//                     error: "User not found",
//                     time: new Date(),
//                     runtime: 0,
//                     language: "JavaScript",
//                     memory: Math.random() * 80,
//                     code_body: undefined,
//                 },
//             ]);
//             return;
//         }

//         const history = user.submissions || [];

//         if (problem) {
//             try {
//                 const resolve = await writeTestFile(code, problem.test, problem.function_name);

//                 console.log(code);
//                 console.log(problem.test);
//                 console.log(problem.function_name);
                
                
                

//                 if (resolve.stdout !== undefined) {
//                     const submission = [
//                         {
//                             problem_name,
//                             status: resolve.stdout.status,
//                             error: resolve.stdout.error_message,
//                             time: resolve.stdout.date,
//                             runtime: resolve.stdout.runtime,
//                             language: "JavaScript",
//                             memory: Math.random() * 80,
//                             code_body: resolve.code_body,
//                             input: resolve.stdout.input,
//                             expected_output: resolve.stdout.expected_output,
//                             user_output: resolve.stdout.user_output,
//                         },
//                         ...history,
//                     ];

//                     const subsByName = submission.filter(
//                         (elem) => elem.problem_name === problem_name
//                     );

//                     user.submissions = submission;

//                     if (submission[0].status === "Accepted") {
//                         if (!user.problems_solved.includes(problem_name)) {
//                             user.problems_solved.push(problem_name);
//                             user.problems_solved_count += 1;
//                         }
//                     } else {
//                         if (!user.problems_attempted.includes(problem_name)) {
//                             user.problems_attempted.push(problem_name);
//                         }
//                     }

//                     await user.save();
//                     res.json(subsByName);
//                 }
//             } catch (error) {
//                 const submission = [
//                     {
//                         problem_name,
//                         status: "Runtime Error",
//                         error,
//                         time: new Date(),
//                         runtime: 0,
//                         language: "JavaScript",
//                         memory: Math.random() * 80,
//                         code_body: undefined,
//                     },
//                     ...history,
//                 ];

//                 if (!user.problems_attempted.includes(problem_name)) {
//                     user.problems_attempted.push(problem_name);
//                 }

//                 const subsByName = submission.filter(
//                     (elem) => elem.problem_name === problem_name
//                 );

//                  user.submissions = submission;
//                 await user.save();
//                 res.json(subsByName);
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });
solutionRouter.post("/submit/:name",authMiddleware,SolutionController.submit);
// solutionRouter.post("/uniqueproblem",authMiddleware,submissioncontroller.getProblemsSolvedUnique)
// solutionRouter.get("/allsubmission/:id",authMiddleware,submissioncontroller.getAllSubmission)

export default solutionRouter;
