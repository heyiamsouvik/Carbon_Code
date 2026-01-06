module.exports = function greenScore(report) {
  const score =
    normalize(report.highImpact.executionWeightDelta) * 0.4 +
    normalize(report.highImpact.co2SavedPer1000Runs) * 0.4 +
    normalize(report.mustHave.cyclomaticComplexity.improvement) * 0.2;

  return Math.min(100, Math.max(0, Math.round(score)));
};

function normalize(value) {
  return Math.min(100, Math.max(0, value));
}
