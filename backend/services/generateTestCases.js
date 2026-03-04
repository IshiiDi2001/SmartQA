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

    let response;
    try {
      response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      });
    } catch (err) {
      throw new Error(`Groq API error: ${err.message || String(err)}`);
    }

    if (
      !response ||
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message ||
      typeof response.choices[0].message.content !== "string"
    ) {
      throw new Error(
        "Invalid Groq response shape: " + JSON.stringify(response),
      );
    }

    let content = response.choices[0].message.content;

    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(content);
    } catch (err) {
      throw new Error(
        `Failed to parse Groq response JSON: ${err.message}. Response content: ${
          content && content.length > 1000
            ? content.slice(0, 1000) + "..."
            : content
        }`,
      );
    }
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
