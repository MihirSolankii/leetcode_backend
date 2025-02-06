// import * as acorn from "acorn";


//   const handleTestFunction = `
// function handleTests(testCases, func) {
//     let testCase;
//     let problemInput;
//     let expectedOut;
//     let yourOut;
//     let testCaseNumber;
//     let status;
//     let ERR;
//     let date = new Date();
//     let runtime;
//     let t1;
//     for (let i = 0; i < testCases.length; i++) {
//         let out;
//         try {
//             const input = testCases[i].slice(0, testCases[i].length - 1);
//             const exOutput = testCases[i][testCases[i].length - 1];
//             t1 = performance.now();
//             out = func(...input);
//             if (!equality(out, exOutput)) {
//                 problemInput = JSON.stringify(input);
//                 testCase = testCases[i];
//                 expectedOut = JSON.stringify(exOutput);
//                 yourOut = JSON.stringify(out);
//                 testCaseNumber = i;
//                 status = "Wrong Answer";

//                 ERR = \`Wrong answer; Test Case Number: \${i}; Input: \${JSON.stringify(input)}; Expected Output: \${exOutput}; Your Output: \${out};\`;
//             }
//         } catch (e) {
//             ERR = e;
//             status = "Runtime Error";
//         }
//     }
//     runtime = performance.now() - t1;

//     if (ERR == undefined && testCase == undefined) status = "Accepted";
//     return \`{ "status":"\${status}",\n"date":"\${date}",\n"runtime": "\${runtime}",\n"error_message": "\${ERR}",\n"test_case_number" :"\${testCaseNumber}",\n"test_case":"\${testCase}",\n"input": "\${problemInput}",\n"expected_output":"\${expectedOut}",\n"user_output":"\${yourOut}"\n}\`;
// }

// function equality(item1, item2) {
//     const isArrayItem1 = Array.isArray(item1);
//     const isArrayItem2 = Array.isArray(item2);
//     if (isArrayItem1 !== isArrayItem2) return false;
//     if (isArrayItem1) {
//         if (item1.length !== item2.length) return false;
//         for (let i = 0; i < item1.length; i++) {
//             const indexof = item2.indexOf(item1[i]);
//             if (indexof === -1) return false;
//             item2.splice(indexof, 1);
//         }
//         if (item2.length !== 0) return false;
//         else return true;
//     }
//     return item1 === item2;
// }`;



//  function writeTestFile(codeBody, testCases, functionName) {
//     console.log("in the write test", codeBody, testCases, functionName);
    
//     try {
//         acorn.parse(codeBody, { ecmaVersion: 2022 });
//     } catch (e) {
//         console.log(e);
//         return new Promise((resolve, reject) => {
//             reject({
//                 stdout: {
//                     status: "Runtime Error",
//                     date: new Date(),
//                     runtime: 0,
//                     error_message: "Runtime Error",
//                     test_case_number: undefined,
//                     test_case: undefined,
//                     expected_output: undefined,
//                     user_output: undefined,
//                 },
//                 stdout_string: String(e),
//                 stderr: "",
//                 code_body: codeBody,
//             });
//         });
//     }
//     let data =
//         "(function x() { try {" +
//         codeBody +
//         handleTestFunction +
//         `try { return (handleTests(${JSON.stringify(
//             testCases
//         )}, ${functionName})); } catch (e) { return (\`{ "status":"Runtime Error",
//         "date":"${new Date()}",
//         "runtime": 0,
//         "error_message": "\${e}",
//         "test_case_number" :"undefined",
//         "test_case":"undefined",
//         "expected_output":"undefined",
//         "user_output":"undefined"
//         }\`); }} catch (e) { return (\`{ "status":"Runtime Error",
//         "date":"${new Date()}",
//         "runtime": 0,
//         "error_message": "\${e}",
//         "test_case_number" :"undefined",
//         "test_case":"undefined",
//         "expected_output":"undefined",
//         "user_output":"undefined"
//         }\`); }})()`;

//     return new Promise((resolve, reject) => {
//         try {
//             const stdout = eval(data);
//             console.log(stdout);
//             resolve({
//                 stdout: JSON.parse(stdout),
//                 stdout_string: stdout,
//                 stderr: "",
//                 code_body: codeBody,
//             });
//         } catch (error) {
//             reject({
//                 stdout: error,
//                 stdout_string: "",
//                 stderr: "",
//                 code_body: codeBody,
//             });
//         }
//     });
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// function writeTestFile(codeBody, testCases, functionName) {
//     try {
//         acorn.parse(codeBody, { ecmaVersion: 2022 });
//     } catch (e) {
//         console.log(e);
//         return Promise.reject({
//             stdout: {
//                 status: "Runtime Error",
//                 date: new Date(),
//                 runtime: 0,
//                 error_message: "Syntax Error: " + e.message,
//                 test_case_number: undefined,
//                 test_case: undefined,
//                 expected_output: undefined,
//                 user_output: undefined,
//             },
//             stdout_string: String(e),
//             stderr: "",
//             code_body: codeBody,
//         });
//     }

//     // Ensure testCases is an array
//     if (!Array.isArray(testCases)) {
//         return Promise.reject({
//             stdout: {
//                 status: "Runtime Error",
//                 date: new Date(),
//                 runtime: 0,
//                 error_message: "Test cases must be an array",
//                 test_case_number: undefined,
//                 test_case: undefined,
//                 expected_output: undefined,
//                 user_output: undefined,
//             },
//             stdout_string: "Test cases must be an array",
//             stderr: "",
//             code_body: codeBody,
//         });
//     }

//     const handleTestsFunction = `
//     function handleTests(testCases, func) {
//         let testCase;
//         let problemInput;
//         let expectedOut;
//         let yourOut;
//         let testCaseNumber;
//         let status;
//         let ERR;
//         let date = new Date();
//         let runtime;
//         let t1;

//         for (let i = 0; i < testCases.length; i++) {
//             let out;
//             try {
//                 if (!Array.isArray(testCases[i])) {
//                     throw new Error(\`Test case \${i} is not an array\`);
//                 }

//                 const input = testCases[i].slice(0, -1);
//                 const exOutput = testCases[i][testCases[i].length - 1];
//                 t1 = performance.now();
//                 out = func(...input);
//                 if (!equality(out, exOutput)) {
//                     problemInput = JSON.stringify(input);
//                     testCase = testCases[i];
//                     expectedOut = JSON.stringify(exOutput);
//                     yourOut = JSON.stringify(out);
//                     testCaseNumber = i;
//                     status = "Wrong Answer";

//                     ERR = \`Wrong answer; Test Case Number: \${i}; Input: \${JSON.stringify(input)}; Expected Output: \${exOutput}; Your Output: \${out};\`;
//                 }
//             } catch (e) {
//                 ERR = e.message || e;
//                 status = "Runtime Error";
//                 testCaseNumber = i;
//                 break;
//             }
//         }
//         runtime = performance.now() - t1;

//         if (ERR == undefined && testCase == undefined) status = "Accepted";
//         return JSON.stringify({
//             status: status,
//             date: date,
//             runtime: runtime,
//             error_message: ERR,
//             test_case_number: testCaseNumber,
//             test_case: testCase,
//             input: problemInput,
//             expected_output: expectedOut,
//             user_output: yourOut
//         });
//     }

//     function equality(item1, item2) {
//         const isArrayItem1 = Array.isArray(item1);
//         const isArrayItem2 = Array.isArray(item2);
//         if (isArrayItem1 !== isArrayItem2) return false;
//         if (isArrayItem1) {
//             if (item1.length !== item2.length) return false;
//             for (let i = 0; i < item1.length; i++) {
//                 const indexof = item2.indexOf(item1[i]);
//                 if (indexof === -1) return false;
//                 item2.splice(indexof, 1);
//             }
//             if (item2.length !== 0) return false;
//             else return true;
//         }
//         return item1 === item2;
//     }`;

//     let data = `
//     (function() { 
//         try {
//             ${codeBody}
//             ${handleTestsFunction}
//             return handleTests(${JSON.stringify(testCases)}, ${functionName});
//         } catch (e) {
//             return JSON.stringify({
//                 status: "Runtime Error",
//                 date: new Date(),
//                 runtime: 0,
//                 error_message: e.message,
//                 test_case_number: undefined,
//                 test_case: undefined,
//                 expected_output: undefined,
//                 user_output: undefined
//             });
//         }
//     })()`;

//     return new Promise((resolve, reject) => {
//         try {
//             const result = eval(data);
//             console.log(result);
//             resolve({
//                 stdout: JSON.parse(result),
//                 stdout_string: result,
//                 stderr: "",
//                 code_body: codeBody,
//             });
//         } catch (error) {
//             reject({
//                 stdout: {
//                     status: "Runtime Error",
//                     date: new Date(),
//                     runtime: 0,
//                     error_message: error.message,
//                     test_case_number: undefined,
//                     test_case: undefined,
//                     expected_output: undefined,
//                     user_output: undefined,
//                 },
//                 stdout_string: error.message,
//                 stderr: "",
//                 code_body: codeBody,
//             });
//         }
//     });
// }

// export { writeTestFile };


// import * as acorn from 'acorn';

// // Utility Functions
// export function equality(item1, item2) {
//     const isArrayItem1 = Array.isArray(item1);
//     const isArrayItem2 = Array.isArray(item2);
    
//     if (isArrayItem1 !== isArrayItem2) return false;
    
//     if (isArrayItem1) {
//         if (item1.length !== item2.length) return false;
//         const item2Copy = [...item2];
        
//         for (let i = 0; i < item1.length; i++) {
//             const indexof = item2Copy.indexOf(item1[i]);
//             if (indexof === -1) return false;
//             item2Copy.splice(indexof, 1);
//         }
//         return item2Copy.length === 0;
//     }
    
//     return item1 === item2;
// }

// export function validateCode(codeBody) {
//     try {
//         acorn.parse(codeBody, { ecmaVersion: 2022 });
//         return true;
//     } catch (e) {
//         return {
//             error: e,
//             status: "Runtime Error",
//             date: new Date(),
//             runtime: 0,
//             error_message: String(e),
//             test_case_number: undefined,
//             test_case: undefined,
//             expected_output: undefined,
//             user_output: undefined
//         };
//     }
// }

// // Core Test Runner
// export function handleTests(testCases, func) {
//     let testCase = null;
//     let problemInput = null;
//     let expectedOut = null;
//     let yourOut = null;
//     let testCaseNumber = null;
//     let status = "Accepted";
//     let ERR = null;
//     let date = new Date();
//     let runtime = 0;
//     let t1;
//   const results=[];
//     for (let i = 0; i < testCases.length; i++) {
//         try {
//             const input = testCases[i].slice(0, testCases[i].length - 1);
//             const exOutput = testCases[i][testCases[i].length - 1];
//             t1 = performance.now();
//             const out = func(...input);
//             runtime = performance.now() - t1;

//             if (!equality(out, exOutput)) {
//                 problemInput = JSON.stringify(input);
//                 testCase = testCases[i];
//                 expectedOut = JSON.stringify(exOutput);
//                 yourOut = JSON.stringify(out);
//                 testCaseNumber = i;
//                 status = "Wrong Answer";
//                 ERR = `Wrong answer; Test Case Number: ${i}; Input: ${JSON.stringify(input)}; Expected Output: ${exOutput}; Your Output: ${out};`;
//                 break;
//             }

//             // Store successful test case info
//             problemInput = JSON.stringify(input);
//             testCase = testCases[i];
//             expectedOut = JSON.stringify(exOutput);
//             yourOut = JSON.stringify(out);
//             testCaseNumber = i;

//         } catch (e) {
//             ERR = e;
//             status = "Runtime Error";
//             break;
//         }
//         results.push({
//             status: status,
//             date: date.toString(),
//             runtime: runtime.toString(),
//             error_message: ERR,
//             test_case_number: i + 1,
//             test_case: testCases[i],
//             input: testCases[i].slice(0, testCases[i].length - 1),
//             expected_output: testCases[i][testCases[i].length - 1],
//             user_output: out
//         });
//     }

//     return JSON.stringify(results, null, 2);

    
// }

// // Test Executor
// export function writeTestFile(codeBody, testCases, functionName) {
//     const validationResult = validateCode(codeBody);
    
//     if (validationResult !== true) {
//         return Promise.reject({
//             stdout: validationResult,
//             stdout_string: String(validationResult.error_message),
//             stderr: "",
//             code_body: codeBody
//         });
//     }

//     const wrappedCode = `
//         (function x() { 
//             try {
//                 ${codeBody}
                
//                 ${handleTests.toString()}
                
//                 try { 
//                     return handleTests(${JSON.stringify(testCases)}, ${functionName}); 
//                 } catch (e) { 
//                     return JSON.stringify({
//                         status: "Runtime Error",
//                         date: new Date().toString(),
//                         runtime: 0,
//                         error_message: String(e),
//                         test_case_number: undefined,
//                         test_case: undefined,
//                         expected_output: undefined,
//                         user_output: undefined
//                     });
//                 }
//             } catch (e) { 
//                 return JSON.stringify({
//                     status: "Runtime Error",
//                     date: new Date().toString(),
//                     runtime: 0,
//                     error_message: String(e),
//                     test_case_number: undefined,
//                     test_case: undefined,
//                     expected_output: undefined,
//                     user_output: undefined
//                 });
//             }
//         })()
//     `;

//     return new Promise((resolve, reject) => {
//         try {
//             const stdout = eval(wrappedCode);
//             resolve({
//                 stdout: JSON.parse(stdout),
//                 stdout_string: stdout,
//                 stderr: "",
//                 code_body: codeBody
//             });
//         } catch (error) {
//             reject({
//                 stdout: error,
//                 stdout_string: "",
//                 stderr: "",
//                 code_body: codeBody
//             });
//         }
//     });
// }

// const sampleCode = `
// function findMissingNumber(arr) {
//     const n = arr.length + 1;
//     const sum = (n * (n + 1)) / 2;
//     const arrSum = arr.reduce((acc, curr) => acc + curr, 0);
//     return sum - arrSum;
// }
// `;

// const testCases = [
//     [[1, 2, 4], 3],          // Missing number 3
//     [[1, 3, 4, 5], 2],       // Missing number 2
//     [[2, 3, 4], 1],          // Missing number 1
//     [[1, 2, 3, 4, 6], 5],    // Missing number 5
//     [[1], 2]                 // Missing number 2
// ];

// writeTestFile(sampleCode, testCases, 'findMissingNumber')
//     .then(result => {
//         console.log('Test Results:', result.stdout);
//     })
//     .catch(error => {
//         console.error('Test Error:', error.stdout);
//     });

import * as acorn from 'acorn';

// Utility Functions
export function equality(item1, item2) {
    const isArrayItem1 = Array.isArray(item1);
    const isArrayItem2 = Array.isArray(item2);
    
    if (isArrayItem1 !== isArrayItem2) return false;
    
    if (isArrayItem1) {
        if (item1.length !== item2.length) return false;
        const item2Copy = [...item2];
        
        for (let i = 0; i < item1.length; i++) {
            const indexof = item2Copy.indexOf(item1[i]);
            if (indexof === -1) return false;
            item2Copy.splice(indexof, 1);
        }
        return item2Copy.length === 0;
    }
    
    return item1 === item2;
}

export function validateCode(codeBody) {
    try {
        acorn.parse(codeBody, { ecmaVersion: 2022 });
        return true;
    } catch (e) {
        return {
            error: e,
            status: "Runtime Error",
            date: new Date(),
            runtime: 0,
            error_message: String(e),
            test_case_number: undefined,
            test_case: undefined,
            expected_output: undefined,
            user_output: undefined
        };
    }
}

// Core Test Runner
export function handleTests(testCases, func) {
    let results = [];
    let date = new Date();
    let t1;

    for (let i = 0; i < testCases.length; i++) {
        let out;
        let status = "Accepted";
        let runtime;
        let ERR = null;
        try {
            const input = testCases[i].slice(0, testCases[i].length - 1);
            const exOutput = testCases[i][testCases[i].length - 1];
            t1 = performance.now();
            out = func(...input);
            runtime = performance.now() - t1;

            if (!equality(out, exOutput)) {
                status = "Wrong Answer";
                ERR = `Wrong answer; Test Case Number: ${i}; Input: ${JSON.stringify(input)}; Expected Output: ${exOutput}; Your Output: ${out};`;
            }

        } catch (e) {
            out = null;
            status = "Runtime Error";
            ERR = e.message || e;
            runtime = performance.now() - t1;
        }

        results.push({
            status: status,
            date: date.toString(),
            runtime: runtime.toString(),
            error_message: ERR,
            test_case_number: i + 1,
            test_case: testCases[i],
            input: testCases[i].slice(0, testCases[i].length - 1),
            expected_output: testCases[i][testCases[i].length - 1],
            user_output: out
        });
    }

    return JSON.stringify(results, null, 2);
}

// Test Executor
export function writeTestFile(codeBody, testCases, functionName) {
    const validationResult = validateCode(codeBody);
    
    if (validationResult !== true) {
        return Promise.reject({
            stdout: validationResult,
            stdout_string: String(validationResult.error_message),
            stderr: "",
            code_body: codeBody
        });
    }

    const wrappedCode = `
        (function x() { 
            try {
                ${codeBody}
                
                ${handleTests.toString()}
                
                try { 
                    return handleTests(${JSON.stringify(testCases)}, ${functionName}); 
                } catch (e) { 
                    return JSON.stringify({
                        status: "Runtime Error",
                        date: new Date().toString(),
                        runtime: 0,
                        error_message: String(e),
                        test_case_number: undefined,
                        test_case: undefined,
                        expected_output: undefined,
                        user_output: undefined
                    });
                }
            } catch (e) { 
                return JSON.stringify({
                    status: "Runtime Error",
                    date: new Date().toString(),
                    runtime: 0,
                    error_message: String(e),
                    test_case_number: undefined,
                    test_case: undefined,
                    expected_output: undefined,
                    user_output: undefined
                });
            }
        })()
    `;

    return new Promise((resolve, reject) => {
        try {
            const stdout = eval(wrappedCode);
            resolve({
                stdout: JSON.parse(stdout),
                stdout_string: stdout,
                stderr: "",
                code_body: codeBody
            });
        } catch (error) {
            reject({
                stdout: {
                    status: "Runtime Error",
                    date: new Date(),
                    runtime: 0,
                    error_message: error.message,
                    test_case_number: undefined,
                    test_case: undefined,
                    expected_output: undefined,
                    user_output: undefined
                },
                stdout_string: error.message,
                stderr: "",
                code_body: codeBody
            });
        }
    });
}

const sampleCode = `
function findMissingNumber(arr) {
    const n = arr.length + 1;
    const sum = (n * (n + 1)) / 2;
    const arrSum = arr.reduce((acc, curr) => acc + curr, 0);
    return sum - arrSum;
}
`;

const testCases = [
    [[1, 2, 4], 3],          // Missing number 3
    [[1, 3, 4, 5], 2],       // Missing number 2
    [[2, 3, 4], 1],          // Missing number 1
    [[1, 2, 3, 4, 6], 5],    // Missing number 5
    [[1], 2]                 // Missing number 2
];

writeTestFile(sampleCode, testCases, 'findMissingNumber')
    .then(result => {
        console.log('Test Results:', result.stdout);
    })
    .catch(error => {
        console.error('Test Error:', error.stdout);
    });


    


