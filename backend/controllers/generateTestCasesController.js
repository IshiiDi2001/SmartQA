const generateTestCases = require("../services/generateTestCases");

// Load server-side Groq API key
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const generateTestCasesController = async (req, res) => {
  try {
    const { stories } = req.body;

    if (!stories || stories.length === 0) {
      return res.status(400).json({
        message: "Stories are required",
      });
    }

    if (!GROQ_API_KEY) {
      return res.status(500).json({
        message: "Server Groq API key is not configured",
      });
    }

    const testCases = await generateTestCases(stories, GROQ_API_KEY);

    res.status(200).json({
      success: true,
      testCases,
    });
  } catch (error) {
    console.error("Generate Test Cases Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Test case generation failed",
      error: error.message,
    });
  }
};

module.exports = generateTestCasesController;
