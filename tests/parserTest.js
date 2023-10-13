var natural = require("natural");
var text = "\nSolve the quadratic equation 3x^2 + 4x - 5 = 0.\nFind the roots of the polynomial x^3 - 6x^2 + 11x - 6 = 0.\nCompute the derivative of the function f(x) = x^2 + 2x - 3.\nEvaluate the integral of x^2 with respect to x.\nCompute the limit of (1 - cos(x))/x^2 as x approaches 0.\nSolve the system of equations 2x + 3y = 5 and x - y = 1.\nFind the sine of x plus the cosine of x: sin(x) + cos(x).\nCompute the tangent of x when tan(x) = sqrt(3).\nEvaluate the secant of x plus the cosecant of x: sec(x) + csc(x).\nCompute the determinant of matrix A: |A|.\nEvaluate the trace of matrix A: trace(A).\nCheck the commutativity of matrices A and B: A*B = B*A.\nCompute the divergence of vector field F: div(F) = 0.\nEvaluate the curl of vector field F: curl(F) = 0.\nCompute the line integral of vector field F along curve C: int(C, F . dr).\nSolve the differential equation y'' + y = 0.\nSolve the first order linear differential equation y' + p(x)y = q(x).\n";
var tokenizer = new natural.SentenceTokenizer();
var sentences = tokenizer.tokenize(text); // Assuming 'text' is your input text.
// Define a regular expression to match equations.
var equationRegex = /[A-Za-z]+\([^)]*\)|[A-Za-z]+\s*\([-+]*\d+\)|[xy]*\s*[-+=]*\s*\d+(\s*[-+]\s*\d+(\s*[-+]\s*\d+)*)*\s*=\s*\d+|[xy]\s*[-+=]*\s*[xy\d]+\s*[\^]*\s*\d+|[A-Za-z]+\s*[-+]*\s*[A-Za-z]+|[A-Za-z]+\s*[-+]*\s*[xy\d]+\s*[-+]*\s*[A-Za-z]+/g;
var equations = [];
// Define a function to check if a sentence contains equations.
function containsEquations(sentence) {
    var matches = sentence.match(equationRegex);
    return matches !== null;
}
sentences.forEach(function (sentence) {
    if (containsEquations(sentence)) {
        equations.push(sentence);
    }
});
console.log(equations);
