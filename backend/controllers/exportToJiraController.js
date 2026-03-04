const axios = require("axios");

const exportToJiraController = async (req, res) => {
  try {
    const { accessToken, testCases, generatedTestCasesField } = req.body;

    if (!accessToken)
      return res.status(400).json({ message: "Access token missing" });

    if (!testCases || testCases.length === 0)
      return res.status(400).json({ message: "No test cases" });

    // ✅ Get cloudId
    const resources = await axios.get(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const cloudId = resources.data[0].id;

    // ✅ Loop stories
    for (const story of testCases) {
      const formattedText = formatTestCases(story.testCases);

      await axios.put(
        `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${story.storyKey}`,
        {
          fields: {
            [generatedTestCasesField]: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: formattedText,
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
    }

    res.json({
      success: true,
      message: "Test cases exported to Jira successfully",
    });
  } catch (err) {
    console.error("Export Jira Error:", err.response?.data || err.message);

    res.status(500).json({
      message: "Export to Jira failed",
    });
  }
};

/* ---------- FORMAT TEST CASES ---------- */

function formatTestCases(testCases) {
  let text = "";

  testCases.forEach((tc) => {
    text += `TC-${tc.id}: ${tc.title}\n`;

    tc.steps.forEach((step, i) => {
      text += `   ${i + 1}. ${step}\n`;
    });

    text += `Expected Result: ${tc.expectedResult}\n\n`;
  });

  return text;
}

module.exports = exportToJiraController;
