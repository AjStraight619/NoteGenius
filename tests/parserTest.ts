const natural = require("natural");

const text = `
Solve the quadratic equation 3x^2 + 4x - 5 = 0.
Find the roots of the polynomial x^3 - 6x^2 + 11x - 6 = 0.
Compute the derivative of the function f(x) = x^2 + 2x - 3.
Evaluate the integral of x^2 with respect to x.
Compute the limit of (1 - cos(x))/x^2 as x approaches 0.
Solve the system of equations 2x + 3y = 5 and x - y = 1.
Find the sine of x plus the cosine of x: sin(x) + cos(x).
Compute the tangent of x when tan(x) = sqrt(3).
Evaluate the secant of x plus the cosecant of x: sec(x) + csc(x).
Compute the determinant of matrix A: |A|.
Evaluate the trace of matrix A: trace(A).
Check the commutativity of matrices A and B: A*B = B*A.
Compute the divergence of vector field F: div(F) = 0.
Evaluate the curl of vector field F: curl(F) = 0.
Compute the line integral of vector field F along curve C: int(C, F . dr).
Solve the differential equation y'' + y = 0.
Solve the first order linear differential equation y' + p(x)y = q(x).
`;
const tokenizer = new natural.SentenceTokenizer();
const sentences = tokenizer.tokenize(text); // Assuming 'text' is your input text.

// Define a regular expression to match equations.
const equationRegex =
  /[A-Za-z]+\([^)]*\)|[A-Za-z]+\s*\([-+]*\d+\)|[xy]*\s*[-+=]*\s*\d+(\s*[-+]\s*\d+(\s*[-+]\s*\d+)*)*\s*=\s*\d+|[xy]\s*[-+=]*\s*[xy\d]+\s*[\^]*\s*\d+|[A-Za-z]+\s*[-+]*\s*[A-Za-z]+|[A-Za-z]+\s*[-+]*\s*[xy\d]+\s*[-+]*\s*[A-Za-z]+/g;

const equations: any = [];

// Define a function to check if a sentence contains equations.
function containsEquations(sentence: any) {
  const matches = sentence.match(equationRegex);
  return matches !== null;
}

sentences.forEach((sentence: any) => {
  if (containsEquations(sentence)) {
    equations.push(sentence);
  }
});

console.log(equations);
