// Assuming Express and necessary models are imported

import express from "express";
import { User } from "../models/User.js"; // Replace with actual path to your User model
import authMiddleware from "../middleware/authMiddleware.js";
import ProblemModel from "../models/problem.js";

const router = express.Router();

// Route to get submissions for a specific problem
router.post("/submissions/:name",authMiddleware, async (req, res) => {
    // Extract 'name' parameter from the request
    const { name } = req.params;
    // Extract the user ID from the authenticated user (set by middleware)
    const id = req.user.id;

    try {
        // Fetch the user from the database by ID
        const user = await User.findById(id);
        if(!user) return res.json({
            success: false,
            message: "User not found",
        });
        // If no user is found or the user does not have a submissions field
        if ( !user.submissions) {
            // Return an empty array if no submissions are found
            res.json([]);
            return;
        }
  console.log("user submusssion",user.submissions);
  
        // Filter the submissions to find those with a matching problem_name
       
        


        const subsByName = user.submissions.filter((elem) => {
            if (elem && elem.problem_name) {
                console.log(`Problem name from submission: '${elem.problem_name}'`);
                console.log(`Input name to compare: '${name}'`);
                // If problem_name exists, perform the normalization and comparison
                return elem.problem_name.replace(/\s+/g, ' ').trim().toLowerCase() === name.replace(/\s+/g, ' ').trim().toLowerCase();
            }
            return false; // Return false if problem_name is not available
        });
        

        // Return the filtered list of submissions
        res.json(subsByName);

    } catch (e) {
        // If an error occurs, log the error and return an empty array
        console.log(e);
        res.json([]);
    }
});

router.post("/:name",authMiddleware, async (req, res) => {
    const { name } = req.params;
   const id =req.user.id;

    try {
        const problemData = await ProblemModel.findOne({
            "main.name": name,
        });

        const user = await User.findById(id);

        // Clone the problem data
        const problemJson = JSON.parse(JSON.stringify(problemData));

        if (user && user.problems_attempted.includes(name)) {
            problemJson.main.status = "attempted";
        }
        if (user && user.problems_solved.includes(name)) {
            problemJson.main.status = "solved";
        }

        if (problemJson) {
            res.json(problemJson);
        } else {
            res.json({ error: "problem not found" });
        }
    } catch (e) {
        console.log(e);
    }
});

router.get("/:name/editorial", async (req, res) => {
    const name = req.params.name;
    try {
        const problem = await ProblemModel.findOne({
            "main.name": name,
        });
        if (problem) {
            const response = problem.editorial;
            res.json(response);
        } else {
            res.json({ error: "problem not found" });
        }
    } catch (e) {
        console.log(e);
    }
});

export default router;
