const pushTestCasesService = require("../services/pushTestCases");

const pushTestCasesController = async (req, res) => {
  try {
    const { accessToken, testCases, testCaseField } = req.body;

    if (!accessToken)
      return res.status(400).json({ message: "Access token required" });

    await pushTestCasesService({ accessToken, testCases, testCaseField });

    res
      .status(200)
      .json({ success: true, message: "Test cases pushed successfully" });
  } catch (err) {
    console.error("Push Test Cases Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to push test cases" });
  }
};

module.exports = pushTestCasesController;
