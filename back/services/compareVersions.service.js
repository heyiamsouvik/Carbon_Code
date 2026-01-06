const analyzeCode = require("./codeAnalysis.service");
const {estimateCarbon} = require("./carbon.service");
const calculateExecutionWeight = require("../utils/executionWeight");

module.exports = async function compareVersions(
  oldCode,
  newCode,
  executions,
  region
) {
  const oldMetrics = analyzeCode(oldCode);
  const newMetrics = analyzeCode(newCode);

  const oldWeight = calculateExecutionWeight({ ...oldMetrics, executions });
  const newWeight = calculateExecutionWeight({ ...newMetrics, executions });

  const oldCarbon = await estimateCarbon({ executionWeight: oldWeight, region });
  const newCarbon = await estimateCarbon({ executionWeight: newWeight, region });

  return {
    mustHave: {
      cyclomaticComplexity: diff(
        oldMetrics.cyclomaticComplexity,
        newMetrics.cyclomaticComplexity
      ),
      loc: diff(oldMetrics.loc, newMetrics.loc),
      loopDepth: diff(oldMetrics.loopDepth, newMetrics.loopDepth),
      executionWeight: diff(oldWeight, newWeight),
      co2: diff(oldCarbon.estimatedCO2kg, newCarbon.estimatedCO2kg)
    },

    highImpact: {
      executionWeightDelta: oldWeight - newWeight,
      co2SavedPer1000Runs:
        (oldCarbon.estimatedCO2kg - newCarbon.estimatedCO2kg) * 1000,
      memoryAllocations: diff(
        oldMetrics.memoryAllocations,
        newMetrics.memoryAllocations
      ),
      ioCalls: diff(oldMetrics.ioCalls, newMetrics.ioCalls)
    },

    advanced: {
      deadCodePercent: diff(
        oldMetrics.deadCodePercent,
        newMetrics.deadCodePercent
      ),
      codeSmellScore: diff(
        oldMetrics.codeSmellScore,
        newMetrics.codeSmellScore
      ),
      regionWiseCO2: {
        region,
        old: oldCarbon.estimatedCO2kg,
        new: newCarbon.estimatedCO2kg
      }
    }
  };
};

function diff(oldVal, newVal) {
  if (typeof oldVal !== "number" || typeof newVal !== "number") {
    return {
      old: oldVal,
      new: newVal,
      improvementPercent: null
    };
  }

  if (oldVal === 0) {
    return {
      old: oldVal,
      new: newVal,
      improvementPercent: 0
    };
  }

  const improvementPercent = ((oldVal - newVal) / oldVal) * 100;

  return {
    old: oldVal,
    new: newVal,
    improvementPercent: Number(improvementPercent.toFixed(2))
  };
}

