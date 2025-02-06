// import mongoose from "mongoose";
// import Submission from "../models/Submission.js";
// import {User} from "../models/User.js";
// import Problem from "../models/problem.js";

//   const saveSubmission = async (userId, problemId, code, results) => {
//   console.log("userId is :",userId);
  
// console.log("problemId:", problemId);
// console.log("code:", code);
// console.log("results:", results);
//   try {
//     // Create a new submission with correct field names
//     const submission = new Submission({
//       userId: new mongoose.Types.ObjectId(userId),
//       problemId: new mongoose.Types.ObjectId(problemId),
//       language: "JavaScript",
//       code: code,
//       testCaseResults: results.results,
//       status: results.status,
//     });

// console.log(typeof(results.results));


    
//     await submission.save();

//     const user = await User.findById(userId);
//     if (!user) throw new Error("User not found");

//      user.submissions.push(submission);
//      await user.save();

//     return submission;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to save submission");
//   }
// };
//  // Adjust path as necessary

// /**
//  * Fetch unique problems solved by the logged-in user.
//  * @param {Object} req - Express request object with userId from middleware.
//  * @param {Object} res - Express response object to send the response.
//  */
// const getProblemsSolvedUnique = async (req, res) => {
//   try {
//     const userId = req.user.id;  // Ensure `req.user` is populated (e.g., from JWT middleware)

//     const uniqueProblems = await Submission.distinct('problemId', {
//       userId: new  mongoose.Types.ObjectId(userId) 
//     });

//     const submissions = await Submission.find({ userId: userId });
// // console.log(submissions);
// console.log('User ID:', userId);
//      console.log('Unique problems solved:', uniqueProblems);

//      return res.status(200).json({ message:"solved this unique problem ", problems: uniqueProblems });
//     // return res.status(200).json({ userId:userId });
//   } catch (error) {
//     console.error('Error fetching unique problems:', error);
//     return res.status(500).json({ error: 'Failed to fetch unique problems' });
//   }
// };

// // Example Express route




//  const getAllSubmission = async (req, res) => {
//   try {
   
//     const problemId = req.params.id;
//     const submissions = await Submission.find({
      
//       problem: new mongoose.Types.ObjectId(problemId),
      
//     })
//     console.log(submissions.problemId);
//     console.log(problemId);
    
    
    
//     res.status(200).json({ submissions: submissions });
//   } catch (error) {
//     console.log(error);
//   }
// };

// //  const getAllSubmissions = async (req, res, next) => {
// //   try {
// //     const submissions = await Submission.find({});
// //     return res.status(200).json({ submissions: submissions });
// //   } catch (error) {
// //     console.log(error);
// //   }
// // };
// //  const getProblemsSolvedUnique = async (req, res, next) => {
// //   try {
// //     const userId = req.params.userId;
// //     const user = await User.findById(new mongoose.Types.ObjectId(userId));
// //     let uniqueProblems = await Promise.all(
// //       user.submisssions.map(async (submission) => {
// //         let getSubmission = await Submission.findById(submission._id);
// //         return getSubmission?.problem.toString();
// //       })
// //     );
// //     const problemSet = new Set(uniqueProblems);

// //     const problems = await Promise.all(
// //       Array.from(problemSet).map(async (problem) => {
// //         let returnProblem = await Problem.findById(problem);
// //         return returnProblem;
// //       })
// //     );

// //     res.status(200).json({
// //       results: problems,
// //     });
// //   } catch (error) {
// //     console.log(error);
// //   }
// // };

//  const getAllUserSubmission = async (req, res, next) => {
//   try {
//     const userId = req.params.userId;
//     const problemId = req.params.problemId;

//     const user = await User.findById(new mongoose.Types.ObjectId(userId));
//     let submissions = [];
//     submissions = await Promise.all(
//       user.submisssions.map(async (submission) => {
//         let getSubmission = await Submission.findById(submission._id);
//         submissions.push(getSubmission);
//         let getProblem = await Problem.findById(getSubmission?.problem);

//         // return getSubmission?.problem.toString();

//         return {
//           problemName: getProblem.title,
//           submitted_at: getSubmission.created_at,
//           language: getSubmission.language,
//           difficulty: getProblem.difficulty,
//           status: getSubmission.status,
//         };
//       })
//     );

//     res.status(200).json({
//       results: submissions,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
//  export default{saveSubmission,getProblemsSolvedUnique,getAllSubmission};
