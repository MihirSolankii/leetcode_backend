
import express from "express";

const scrapRouter = express.Router();
import  createProblem  from   "../controller/scrapercontroller.js"; // Adjust the path as necessary
import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import {User,Admin} from "../models/User.js";
import ProblemModel from "../models/problem.js";

scrapRouter.get("/scrape",authMiddleware,isAdmin, createProblem);
scrapRouter.post("/add-problem", authMiddleware, isAdmin, async (req, res) => {
    try {
        const { main, editorial, test, function_name } = req.body;
       
        const user = await User.findById(req.user.id) || await Admin.findById(req.user.id);
    console.log("user is ",user);
    
   console.log("useris for admin",req.user._id);
   console.log("useris for admin abc",req.user.id);
        const problem = new ProblemModel({
            main,
            editorial,
            test,
            function_name,
            addedBy: req.user.id, // Admin's ID
        });

        await problem.save();
     user.problems.push(problem);
       await user.save();
        
    await user.save();
        res.status(201).json({ message: "Problem added successfully", problem });
    } catch (error) {
        res.status(500).json({ message: "Error adding problem", error });
        console.log(error)
    }
});


export default scrapRouter;
