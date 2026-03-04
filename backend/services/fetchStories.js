const axios = require("axios");

// Fetch Jira stories using OAuth token and API v3
const fetchStoriesService = async ({ accessToken, projectKey }) => {
  try {
    // Step 1: Get user's Jira Cloud ID
    const resourcesRes = await axios.get(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!resourcesRes.data || resourcesRes.data.length === 0) {
      throw new Error("No accessible Jira resources found for this account");
    }

    const cloudId = resourcesRes.data[0].id;

    // Step 2: Fetch stories using API v3 + JQL
    const jql = `project = ${projectKey} AND issuetype = Story ORDER BY created ASC`;
    const { acceptanceField, generatedTestCasesField } = await getFieldIds(
      accessToken,
      cloudId,
    );

    const searchRes = await axios.post(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search/jql`,
      {
        jql,
        maxResults: 100,
        fields: [
          "summary",
          "description",
          "labels",
          acceptanceField,
          generatedTestCasesField,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    );

    const issues = searchRes.data.issues || [];
    console.log(
      "RAW Acceptance Field:",
      JSON.stringify(issues[0]?.fields?.[acceptanceField], null, 2),
    );

    // Step 3: Convert Jira ADF to text
    const parseADF = (adf) => {
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
    };

    // Step 4: Map issues to stories
    return {
      stories: issues.map((issue) => ({
        key: issue.key || "N/A",
        summary: issue.fields?.summary || "N/A",
        description: parseADF(issue.fields?.description),
        acceptanceCriteria: parseADF(issue.fields?.[acceptanceField]),
        generatedTestCases: parseADF(issue.fields?.[generatedTestCasesField]),
        labels: issue.fields?.labels || [],
      })),
      acceptanceField,
      generatedTestCasesField,
    };
  } catch (err) {
    console.error(
      "OAuth + fetch stories error:",
      err.response?.data || err.message,
    );
    throw err;
  }
};

const getFieldIds = async (accessToken, cloudId) => {
  const res = await axios.get(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/field`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    },
  );

  const fields = res.data;

  const acceptanceField = fields.find(
    (f) => f.name.toLowerCase() === "acceptance criteria",
  )?.id;

  const generatedTestCasesField = fields.find(
    (f) => f.name.toLowerCase() === "generated test cases",
  )?.id;

  return {
    acceptanceField,
    generatedTestCasesField,
  };
};
module.exports = fetchStoriesService;
