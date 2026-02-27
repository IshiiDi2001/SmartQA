require("dotenv").config();
const fs = require("fs");
const axios = require("axios");

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const TEST_CASES_FIELD = process.env.JIRA_TEST_CASES_FIELD;

function convertTestCasesToADF(testCases) {
  const content = [];

  testCases.forEach((tc, idx) => {
    // Title
    content.push({
      type: "paragraph",
      content: [{ type: "text", text: `Test Case ${idx + 1}: ${tc.title}` }],
    });

    // Steps
    tc.steps.forEach((step, sidx) => {
      const cleanedStep = step.replace(/^Step\s*\d+:\s*/i, "");

      content.push({
        type: "paragraph",
        content: [{ type: "text", text: `Step ${sidx + 1}: ${cleanedStep}` }],
      });
    });

    // Expected Result
    content.push({
      type: "paragraph",
      content: [
        { type: "text", text: `Expected Result: ${tc.expectedResult}` },
      ],
    });

    // Empty paragraph for spacing
    content.push({ type: "paragraph", content: [{ type: "text", text: "" }] });
  });

  return { type: "doc", version: 1, content };
}

(async () => {
  const testCasesData = JSON.parse(fs.readFileSync("testCases.json", "utf-8"));

  for (const story of testCasesData) {
    console.log(`Processing Story: ${story.storyKey} - ${story.storySummary}`);

    try {
      const adfBody = convertTestCasesToADF(story.testCases);

      await axios.put(
        `${JIRA_BASE_URL}/rest/api/3/issue/${story.storyKey}`,
        {
          fields: { [TEST_CASES_FIELD]: adfBody },
        },
        {
          auth: {
            username: JIRA_EMAIL,
            password: JIRA_API_TOKEN,
          },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      console.log(`Successfully updated ${story.storyKey}`);
    } catch (error) {
      console.error(
        `Failed to update ${story.storyKey}:`,
        error.response?.data || error.message,
      );
    }
  }

  console.log("All stories updated with test cases!");
})();
