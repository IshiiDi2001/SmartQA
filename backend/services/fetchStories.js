const axios = require("axios");

// Parse Jira ADF text
function parseADF(adf) {
  if (!adf || !adf.content) return "N/A";

  let text = [];

  adf.content.forEach((block) => {
    block.content?.forEach((item) => {
      if (item.text) text.push(item.text);
    });
  });

  return text.join("\n");
}

async function fetchStories(config) {
  const { jiraBaseUrl, email, apiToken, projectKey, acceptanceField } = config;

  const url = `${jiraBaseUrl.replace(/\/$/, "")}/rest/api/3/search/jql`;

  const response = await axios.post(
    url,
    {
      jql: `project = ${projectKey} AND issuetype = Story ORDER BY created ASC`,
      maxResults: 100,
      fields: ["summary", "description", "labels", acceptanceField],
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

  return response.data.issues.map((issue) => ({
    key: issue.key,
    summary: issue.fields?.summary,
    description: parseADF(issue.fields?.description),
    acceptanceCriteria: parseADF(issue.fields?.[acceptanceField]),
    labels: issue.fields?.labels || [],
  }));
}

module.exports = fetchStories;
