const generateTestCases = require("../services/generateTestCases");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const generateTestCasesController = async (req, res) => {
  try {
    const { stories } = req.body;

    if (!stories || stories.length === 0) {
      return res.status(400).json({ message: "Stories are required" });
    }

    if (!GROQ_API_KEY) {
      return res
        .status(500)
        .json({ message: "Server Groq API key is not configured" });
    }

    let testCases = await generateTestCases(stories, GROQ_API_KEY);

    if (typeof testCases === "string") {
      // Remove ```json ... ``` or ``` ... ``` wrappers anywhere
      testCases = testCases.replace(/```(?:json)?/g, "").trim();

      try {
        testCases = JSON.parse(testCases);
      } catch (err) {
        console.error("Failed to parse test cases JSON:", err.message);
        testCases = { raw: testCases }; // fallback
      }
    }

    res.status(200).json({ success: true, testCases });
  } catch (error) {
    console.error("Generate Test Cases Error:", error);
    res.status(500).json({
      success: false,
      message: "Test case generation failed",
      error: error.message || String(error),
    });
  }
};

module.exports = generateTestCasesController;
