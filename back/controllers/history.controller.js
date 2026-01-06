const User = require("../models/User");


exports.getHistory = async (req, res) => {
  const { userId } = req.params;

  const history = await User
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({ success: true, history });
};
