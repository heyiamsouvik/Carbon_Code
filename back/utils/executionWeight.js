module.exports = ({
  cyclomaticComplexity,
  loopDepth,
  functionCount,
  executions
}) => {
  return (
    cyclomaticComplexity *
    Math.pow(2, loopDepth) *
    functionCount *
    executions
  );
};
