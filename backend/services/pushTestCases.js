const axios = require("axios");

function convertTestCasesToADF(testCases) {
  const content = [];

  testCases.forEach((tc, idx) => {
    content.push({
      type: "paragraph",
      content: [{ type: "text", text: `Test Case ${idx + 1}: ${tc.title}` }],
    });

    tc.steps.forEach((step, i) => {
      content.push({
        type: "paragraph",
        content: [
          {
            type: "text",
            text: `Step ${i + 1}: ${step}`,
          },
        ],
      });
    });

    content.push({
      type: "paragraph",
      content: [
        {
          type: "text",
          text: `Expected Result: ${tc.expectedResult}`,
        },
      ],
    });
  });

  return { type: "doc", version: 1, content };
}

async function pushTestCases(config, stories) {
  const { jiraBaseUrl, email, apiToken, testCaseField } = config;

  for (const story of stories) {
    const adf = convertTestCasesToADF(story.testCases);

    await axios.put(
      `${jiraBaseUrl}/rest/api/3/issue/${story.storyKey}`,
      {
        fields: {
          [testCaseField]: adf,
        },
      },
      {
        auth: {
          username: email,
          password: apiToken,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );
  }
}

module.exports = pushTestCases;
