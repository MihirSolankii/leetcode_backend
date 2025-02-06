import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAxtEKdGuE4tYd7Nwh4yiionKbiO7t6NWU'); // Replace with your API key

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});



// Example Usage
const description = `
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]`;

generateTestCases(description)
  .then((cases) => console.log('Generated Test Cases:', cases))
  .catch((error) => console.error(error));
