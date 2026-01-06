// const esprima = require("esprima");
// const estraverse = require("estraverse");
// const escomplex = require("escomplex");
// const calculateExecutionWeight = require("../utils/executionWeight");

// module.exports = (code, executions) => {
//   // AST
//   const ast = esprima.parseScript(code, { tolerant: true });

//   // Cyclomatic Complexity
//   const complexityReport = escomplex.analyse(code);
//   const cyclomaticComplexity = complexityReport.aggregate.cyclomatic;

//   // Loop Depth
//   let currentDepth = 0;
//   let maxDepth = 0;

//   // Function Count
//   let functionCount = 0;

//   estraverse.traverse(ast, {
//     enter(node) {
//       if (
//         node.type === "ForStatement" ||
//         node.type === "WhileStatement" ||
//         node.type === "DoWhileStatement"
//       ) {
//         currentDepth++;
//         maxDepth = Math.max(maxDepth, currentDepth);
//       }

//       if (
//         node.type === "FunctionDeclaration" ||
//         node.type === "FunctionExpression" ||
//         node.type === "ArrowFunctionExpression"
//       ) {
//         functionCount++;
//       }
//     },
//     leave(node) {
//       if (
//         node.type === "ForStatement" ||
//         node.type === "WhileStatement" ||
//         node.type === "DoWhileStatement"
//       ) {
//         currentDepth--;
//       }
//     }
//   });

//   const executionWeight = calculateExecutionWeight({
//     cyclomaticComplexity,
//     loopDepth: maxDepth || 1,
//     functionCount,
//     executions
//   });

//   return {
//     cyclomaticComplexity,
//     loopDepth: maxDepth,
//     functionCount,
//     executionWeight
//   };
// };


const esprima = require("esprima");
const estraverse = require("estraverse");
const escomplex = require("escomplex");
const calculateExecutionWeight = require("../utils/executionWeight");


module.exports = function analyzeCode(code, executions) {
  const ast = esprima.parseScript(code, { loc: true, tolerant: true });

  // ---------------------------
  // MUST-HAVE
  // ---------------------------
  const complexity = escomplex.analyse(code).aggregate.cyclomatic;
  const loc = ast.loc.end.line;


  let functionCount = 0;
  let loopDepth = 0;
  let maxLoopDepth = 0;
  let nestingDepth = 0;
  let maxNestingDepth = 0;

  // ---------------------------
  // HIGH IMPACT
  // ---------------------------
  let memoryAllocations = 0;
  let ioCalls = 0;

  // ---------------------------
  // ADVANCED
  // ---------------------------
  let deadCodeLines = 0;
  let totalStatements = 0;
  let longFunctions = 0;
  let deepNestFunctions = 0;


  estraverse.traverse(ast, {
    enter(node, parent) {
      totalStatements++;


      if (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression"
      ) {
        functionCount++;
    }


      // LOOP DEPTH
      if (["ForStatement", "WhileStatement", "DoWhileStatement"].includes(node.type)) {
        loopDepth++;
        maxLoopDepth = Math.max(maxLoopDepth, loopDepth);
      }

      // NESTING DEPTH
      if (["IfStatement", "SwitchStatement", "TryStatement"].includes(node.type)) {
        nestingDepth++;
        maxNestingDepth = Math.max(maxNestingDepth, nestingDepth);
      }

      // MEMORY ALLOCATION
      if (
        node.type === "NewExpression" ||
        node.type === "ArrayExpression" ||
        node.type === "ObjectExpression"
      ) {
        memoryAllocations++;
      }

      // I/O CALLS
      if (
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        ["fetch", "axios", "readFile", "writeFile", "query"].includes(node.callee.name)
      ) {
        ioCalls++;
      }

      // DEAD CODE (after return)
      if (
        parent?.type === "BlockStatement" &&
        parent.body.some(n => n.type === "ReturnStatement")
      ) {
        deadCodeLines++;
      }

      // CODE SMELLS
      if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression") {
        const fnLength = node.loc.end.line - node.loc.start.line;
        if (fnLength > 50) longFunctions++;
      }
    },

      
    leave(node) {
      if (["ForStatement", "WhileStatement", "DoWhileStatement"].includes(node.type)) {
        loopDepth--;
      }

      if (["IfStatement", "SwitchStatement", "TryStatement"].includes(node.type)) {
        nestingDepth--;
      }
    }
  });



  const executionWeight = calculateExecutionWeight({
    cyclomaticComplexity: complexity,
    loopDepth: maxLoopDepth || 1,
    functionCount: functionCount,
    executions
  });

  return {
    cyclomaticComplexity: complexity,
    loc,
    functionCount, 
    loopDepth: maxLoopDepth,
    nestingDepth: maxNestingDepth,
    memoryAllocations,
    ioCalls,
    deadCodePercent: Number(((deadCodeLines / totalStatements) * 100).toFixed(2)),
    codeSmellScore: longFunctions + deepNestFunctions,
    executionWeight
  };
};
