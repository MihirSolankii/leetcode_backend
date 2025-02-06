
import express from "express"

const router = express.Router();
import { getProblemsByUser,getRandomProblemByUser,getProblemById} from "../controller/problemcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ProblemModel from "../models/problem.js";

import { User,Admin } from "../models/User.js";


// router.get('/problems', authMiddleware, getProblemsByUser);
// router.get('/problems/random/:userId', authMiddleware, getRandomProblemByUser);
router.get("/problems/:id",async (req, res) => {
    const { id } = req.params; // Get the problem ID from the URL parameter

    try {
        // Find the problem by `main.id`
        const problem = await ProblemModel.findOne({ "main.id": id });

        // Check if the problem exists
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // Return the full problem details
        return res.status(200).json({
            id: problem.main.id,
            name: problem.main.name,
            description_body: problem.main.description_body,
            difficulty: problem.main.difficulty,
            like_count: problem.main.like_count,
            dislike_count: problem.main.dislike_count,
            acceptance_rate_count: problem.main.acceptance_rate_count,
            submission_count: problem.main.submission_count,
            discussion_count: problem.main.discussion_count,
            related_topics: problem.main.related_topics,
            similar_questions: problem.main.similar_questions,
            solution_count: problem.main.solution_count,
            code_default_language: problem.main.code_default_language,
            code_body: problem.main.code_body,
            editorial_body: problem.editorial.editorial_body,
            tests: problem.test,
            function_name: problem.function_name,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching the problem",
            error,
        });
    }
});
router.get("/problems", async (req, res) => {
    try {
        console.log("Incoming request to /problems from:", req.headers.referer || "unknown");
        // Fetch all problems from the database
        const problems = await ProblemModel.find({}, {
            "main.id": 1,
            "main.name": 1,
            "main.difficulty": 1,
            "main.like_count": 1,
            "main.dislike_count": 1,
            "main.related_topics"   : 1,
        });

        // Log the raw problems data
          console.log("Raw problems data:", problems);
        

        return res.status(200).json({ problems });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching problems",
            error,
        });
    }
});


router.post("/all", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const search = req.query.search || "";
    const difficulty = req.query.difficulty || "";
    const status = req.query.status || "";
    const relatedTopic = req.query.relatedTopic || ""; // Notice camelCase usage for consistency

    try {
        // Build the MongoDB query
        let query = {};

        // Add search filter if provided
        if (search) {
            query["main.name"] = { $regex: search, $options: "i" };
        }

        // Add difficulty filter if provided
        if (difficulty) {
            query["main.difficulty"] = difficulty;
        }

        // Add related topics filter if provided
        if (relatedTopic) {
            query["main.related_topics"] = { $regex: `^${relatedTopic}$`, $options: "i" };
        }

        // Fetch problems using the constructed query
        const allProblems = await ProblemModel.find(
            query,
            "main.id main.name main.acceptance_rate_count main.difficulty main.like_count main.dislike_count main.related_topics"
        ).sort({ "main.id": 1 });

        // Get user's solved and attempted problems
        const user = await User.findById(userId);
        const solvedProblems = user?.problems_solved || [];
        const attemptedProblems = user?.problems_attempted || [];

        // Add status to problems
        let finalProblems = allProblems.map(problem => {
            const problemObj = problem.toObject();

            // Determine status
            if (solvedProblems.includes(problemObj.main.name)) {
                problemObj.main.status = "solved";
            } else if (attemptedProblems.includes(problemObj.main.name)) {
                problemObj.main.status = "attempted";
            } else {
                problemObj.main.status = "unsolved";
            }

            return problemObj;
        });

        // Apply status filter if provided
        if (status) {
            finalProblems = finalProblems.filter(
                problem => problem.main.status === status
            );
        }

        res.json({ success: true, data: finalProblems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});




export default router;
