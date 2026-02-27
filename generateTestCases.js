require("dotenv").config();
const fs = require("fs");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Read stories
const stories = JSON.parse(fs.readFileSync("stories.json", "utf-8"));

async function generateTestCasesForStory(story) {
  const prompt = `
Act as a Senior Software Quality Engineer.

Generate comprehensive software test cases for the following Jira user story.

Include:
- Positive scenarios
- Negative scenarios
- Boundary testing
- Security testing
- Usability testing

User Story:
${story.summary}

Acceptance Criteria:
${story.acceptanceCriteria}

Do not include any markdown formatting, backticks, or introductory text. Output the raw JSON string only.:

[
  {
    "id": 1,
    "title": "Test Case Title",
    "steps": ["Step 1", "Step 2"],
    "expectedResult": "Expected Result"
  }
]
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const text = response.choices[0].message.content;

    return JSON.parse(text);
  } catch (error) {
    console.error(
      `Error generating test cases for ${story.key}:`,
      error.message,
    );
    return [];
  }
}

(async () => {
  const allTestCases = [];

  for (const story of stories) {
    console.log(`Generating test cases for ${story.key}...`);

    const testCases = await generateTestCasesForStory(story);

    allTestCases.push({
      storyKey: story.key,
      storySummary: story.summary,
      testCases,
    });
  }

  fs.writeFileSync("testCases.json", JSON.stringify(allTestCases, null, 2));

  console.log("✅ Test cases generated using Groq AI");
})();
