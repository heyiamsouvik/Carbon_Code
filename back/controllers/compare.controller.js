const compareVersions = require("../services/compareVersions.service");

exports.compareCode = async (req, res) => {
  try {
    const {
      oldCode,
      newCode,
      executions = 1000,
      region = "ap-south-1"
    } = req.body;

    if (!oldCode || !newCode) {
      return res.status(400).json({
        success: false,
        message: "oldCode and newCode are required"
      });
    }

    const report = await compareVersions(
      oldCode,
      newCode,
      executions,
      region
    );

    res.status(200).json({
      success: true,
      report
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
