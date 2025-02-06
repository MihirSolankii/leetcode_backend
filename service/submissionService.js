import { User } from '../models/User.js';
import ProblemModel  from '../models/problem.js';
import { writeTestFile } from '../utils/createTest.js';

export class SubmissionService {
  static async createSubmission(submission) {
    return {
      ...submission,
      memory: Math.floor(Math.random() * 80), // TODO: Implement actual memory tracking
      language: "JavaScript",
      time: new Date(),
    };
  }

  static async handleSuccessfulSubmission(user, problemName, resolve) {
    const submission = await this.createSubmission({
      problem_name: problemName,
      status: resolve.stdout.status,
      error: resolve.stdout.error_message,
      runtime: resolve.stdout.runtime,
      code_body: resolve.code_body,
      input: resolve.stdout.input,
      expected_output: resolve.stdout.expected_output,
      user_output: resolve.stdout.user_output,
    });

    const updatedSubmissions = [submission, ...user.submissions];

    // Update user statistics
    if (submission.status === "Accepted" && !user.problems_solved.includes(problemName)) {
      user.problems_solved.push(problemName);
      user.problems_solved_count += 1;
    } else if (!user.problems_attempted.includes(problemName)) {
      user.problems_attempted.push(problemName);
    }

    user.submissions = updatedSubmissions;
    await user.save();

    return updatedSubmissions.filter(sub => sub.problem_name === problemName);
  }

  static async handleFailedSubmission(user, problemName, error) {
    const submission = await this.createSubmission({
      problem_name: problemName,
      status: "Runtime Error",
      error: error.message || String(error),
      runtime: 0,
      code_body: undefined,
    });

    if (!user.problems_attempted.includes(problemName)) {
      user.problems_attempted.push(problemName);
    }

    const updatedSubmissions = [submission, ...user.submissions];
    user.submissions = updatedSubmissions;
    await user.save();

    return updatedSubmissions.filter(sub => sub.problem_name === problemName);
  }
}