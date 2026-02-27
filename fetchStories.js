require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;
const ACCEPTANCE_CRITERIA_FIELD = process.env.ACCEPTANCE_CRITERIA_FIELD;

// Parse Jira ADF text
function parseADF(adf) {
  if (!adf || !adf.content) return "N/A";
  let text = [];
  adf.content.forEach((block) => {
    if (block.content) {
      block.content.forEach((item) => {
        if (item.text) text.push(item.text);
      });
    }
  });
  return text.join("\n");
}

// Fetch all stories
async function fetchAllStories() {
  try {
    const url = `${JIRA_BASE_URL.replace(/\/$/, "")}/rest/api/3/search/jql`;

    const jql = `project = ${JIRA_PROJECT_KEY} AND issuetype = Story ORDER BY created ASC`;

    console.log("URL:", url);
    console.log("JQL:", jql);

    const response = await axios.post(
      url,
      {
        jql,
        maxResults: 100,
        fields: ["summary", "description", "labels", ACCEPTANCE_CRITERIA_FIELD],
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

    const issues = response.data.issues;

    if (!issues || issues.length === 0) {
      console.log("No stories found.");
      return;
    }

    const storyData = issues.map((issue) => ({
      key: issue.key || "N/A",
      summary: issue.fields?.summary || "N/A",
      description: parseADF(issue.fields?.description),
      acceptanceCriteria: parseADF(issue.fields?.[ACCEPTANCE_CRITERIA_FIELD]),
      labels: issue.fields?.labels || [],
    }));

    fs.writeFileSync("stories.json", JSON.stringify(storyData, null, 2));
    console.log(`Fetched ${storyData.length} stories. Saved to stories.json`);
  } catch (error) {
    console.error(
      "Error fetching stories:",
      error.response?.data || error.message,
    );
  }
}

fetchAllStories();
