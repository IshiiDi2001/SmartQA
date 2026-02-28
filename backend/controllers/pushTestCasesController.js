const pushTestCases = require("../services/pushTestCases");

const pushTestCasesController = async (req, res) => {
  try {
    const { jiraConfig, testCases } = req.body;

    if (!jiraConfig) {
      return res.status(400).json({
        message: "Jira configuration required",
      });
    }

    if (!testCases || testCases.length === 0) {
      return res.status(400).json({
        message: "Test cases are required",
      });
    }

    await pushTestCases(jiraConfig, testCases);

    res.status(200).json({
      success: true,
      message: "Test cases successfully pushed to Jira",
    });
  } catch (error) {
    console.error(
      "Push Test Cases Error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      success: false,
      message: "Failed to push test cases",
      error: error.message,
    });
  }
};

module.exports = pushTestCasesController;
