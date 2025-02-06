import { User } from '../models/User.js';
import  ProblemModel  from '../models/problem.js';
import { SubmissionService } from '../service/submissionService.js';
import { writeTestFile } from '../utils/createTest.js';
import Submission from '../models/Submission.js';

export class SolutionController {
  static async submit(req, res) {
    const { name } = req.params;
    const {  problem_name, code } = req.body;

    try {
      // Validate input
      if (!name ||  !problem_name || !code) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }
      const userId = req.user.id;
      // Find user and problem
      const [user, problem] = await Promise.all([
        User.findById(userId),
        ProblemModel.findOne({ "main.name": name })
      ]);
      console.log("usrrrris ::",user);
      console.log(userId);
      
      

      if (!user) {
        return res.status(404).json([{
          problem_name,
          status: "Runtime Error",
          error: "User not found",
          time: new Date(),
          runtime: 0,
          language: "JavaScript",
          memory: Math.floor(Math.random() * 80),
          code_body: undefined,
        }]);
      }

      if (!problem) {
        return res.status(404).json({
          success: false,
          message: "Problem not found"
        });
      }
      let history = user.submissions || null;
      try {
        console.log("it is ",problem.test);
        
        const resolve = await writeTestFile(code, problem.test, problem.function_name);
        
        if (!resolve.stdout) {
          throw new Error("Test execution failed");
        }
        const validJsonString = typeof resolve.stdout === "string" ? resolve.stdout : JSON.stringify(resolve.stdout);
        console.log("Valid JSON string:", validJsonString);
    
        const testResults = JSON.parse(validJsonString); // Now parse the valid JSON
        console.log("Parsed test results:", testResults);
           console.log("stdout",resolve.stdout);
           try {
            // Check and debug the resolve.stdout content
            const validJsonString = typeof resolve.stdout === "string" ? resolve.stdout : JSON.stringify(resolve.stdout);
            console.log("Valid JSON string:", validJsonString);
        
            const testResults = JSON.parse(validJsonString); // Now parse the valid JSON
            console.log("Parsed test results:", testResults);
        
            // Process test results
            testResults.forEach((result) => {
                console.log(`Test case ${result.test_case_number} status:`, result.status);
            });
        } catch (error) {
            console.error("Error parsing JSON:", error.message);
        }        
          //  console.log(""resolve.stdout.date);
          //  console.log(resolve.stdout.test_case);
           console.log(code);
           
           const response = {
            problem_name: problem_name,
            status: testResults.every(test => test.status === "Accepted") ? "Accepted" : "Failed",
            error: testResults.find(test => test.status === "Runtime Error")?.error_message || null,
            time: new Date().toISOString(),
            runtime: testResults.reduce((acc, test) => acc + parseFloat(test.runtime), 0).toString(),
            language: "JavaScript",
            memory: Math.random() * 100, // Placeholder for memory usage
            code_body: code,
            test_cases: testResults.map(test => ({
                input: test.input,
                expected_output: test.expected_output,
                user_output: test.user_output,
                status: test.status,
                error_message: test.error_message,
                runtime: test.runtime
            }))
        };
    
        console.log(response);
    
        // return res.status(200).json(response);
           
           
        // const today = new Date().setHours(0, 0, 0, 0); 
          let submission = [
            {
                problem_name: problem_name,
                status: testResults.every(test => test.status === "Accepted") ? "Accepted" : "Failed",
                error: testResults.find(test => test.status === "Runtime Error")?.error_message || null,
                time: new Date().toISOString(),
                runtime: testResults.reduce((acc, test) => acc + parseFloat(test.runtime), 0).toString(),
                language: "JavaScript",
                memory: Math.random() * 80,
                code_body: code,
              test_cases: testResults.map(test => ({
                input: test.input,
                expected_output: test.expected_output,
                user_output: test.user_output,
                status: test.status,
                error_message: test.error_message,
                runtime: test.runtime
            }))
            },
        ];
        if (history) {
          submission = submission.concat(history);
      }

      const subsByName = submission.filter(
          (elem) => elem.problem_name === problem_name
      );
      
      user.submissions = submission;
      

      // Define today's date at midnight in UTC
const today = new Date();
today.setUTCHours(0, 0, 0, 0);

// Normalize function to avoid timezone mismatch
const getMidnightUTC = (date) => {
    const utcDate = new Date(date);
    utcDate.setUTCHours(0, 0, 0, 0);
    return utcDate.getTime();
};

// Find or create today's streak entry
const lastStreakEntry = user.dailyStreaks.length > 0
    ? user.dailyStreaks[user.dailyStreaks.length - 1]
    : null;

if (lastStreakEntry) {
    const lastDateUTC = getMidnightUTC(lastStreakEntry.date);
    const daysDiff = Math.floor((getMidnightUTC(today) - lastDateUTC) / (1000 * 60 * 60 * 24));

    for (let i = 1; i < daysDiff; i++) {
        // Add missing dates with streak 0 in UTC
        user.dailyStreaks.push({
            date: new Date(lastDateUTC + i * 24 * 60 * 60 * 1000).toISOString(),
            streak: 0,
        });
    }
}

// Check if there is already an entry for today in UTC
const todayStreakEntry = user.dailyStreaks.find(
    (entry) => getMidnightUTC(entry.date) === today.getTime()
);

if (todayStreakEntry) {
    // Update today's streak entry with new submissions
    todayStreakEntry.streak += testResults.every(test => test.status === "Accepted") ? 1 : 0;
    user.potdStreak = todayStreakEntry.streak;
} else {
    // Create today's streak entry
    user.dailyStreaks.push({
        date: today.toISOString(),
        streak: testResults.every(test => test.status === "Accepted") ? 1 : 0,
    });
    user.potdStreak = testResults.every(test => test.status === "Accepted") ? 1 : 0;
}

      if (submission[0].status === "Accepted") {
        if (!user.problems_solved.includes(problem_name)) {
            user.problems_solved.push(problem_name);
            user.problems_solved_count += 1;
        }
    } else {
        if (!user.problems_attempted.includes(problem_name)) {
            user.problems_attempted.push(problem_name);
        }
    }
     
      await user.save();
      res.json({success: true,  subsByName,  potdStreak:user.potdStreak,  dailyStreaks:user.dailyStreaks});
        
        

      } catch (error) {
       console.log("error is ",error);
       

        return res.json(error);
      }

    } catch (error) {
      console.error('Submission error:', error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  }
}



