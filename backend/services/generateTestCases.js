const Groq = require("groq-sdk");

async function generateTestCases(stories, groqApiKey) {
  const groq = new Groq({
    apiKey: groqApiKey,
  });

  async function generateForStory(story) {
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

Return RAW JSON ONLY:

[
{
"id":1,
"title":"",
"steps":[""],
"expectedResult":""
}
]
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    return JSON.parse(response.choices[0].message.content);
  }

  const results = [];

  for (const story of stories) {
    const testCases = await generateForStory(story);

    results.push({
      storyKey: story.key,
      storySummary: story.summary,
      testCases,
    });
  }

  return results;
}

module.exports = generateTestCases;
