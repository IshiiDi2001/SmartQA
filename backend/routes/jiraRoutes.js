const express = require("express");
const axios = require("axios");
const router = express.Router();

const generateTestCasesController = require("../controllers/generateTestCasesController");

// Helper: convert Jira ADF to plain text
const parseADF = (adf) => {
  if (!adf) return "";
  if (typeof adf === "string") return adf;
  if (!adf.content) return "";

  const parts = [];
  adf.content.forEach((block) => {
    if (block.content) {
      block.content.forEach((item) => {
        if (item.text) parts.push(item.text);
      });
    }
  });
  return parts.join("\n");
};

router.post("/jira/fetch-stories", async (req, res) => {
  const { accessToken, projectKey } = req.body;
  if (!accessToken)
    return res.status(400).json({ message: "Access token required" });
  if (!projectKey)
    return res.status(400).json({ message: "Project key required" });

  try {
    // Get cloudId
    const resourcesResp = await axios.get(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!resourcesResp.data || resourcesResp.data.length === 0) {
      return res.status(400).json({ message: "No accessible Jira resources" });
    }

    const cloudId = resourcesResp.data[0].id;

    // Fetch available fields to find custom field IDs
    const fieldsResp = await axios.get(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/field`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    );

    const fields = Array.isArray(fieldsResp.data) ? fieldsResp.data : [];

    const acceptanceField = fields.find(
      (f) => f.name && f.name.toLowerCase() === "acceptance criteria",
    )?.id;

    const generatedTestCasesField = fields.find(
      (f) => f.name && f.name.toLowerCase() === "generated test cases",
    )?.id;

    const jql = `project=${projectKey} AND issuetype=Story ORDER BY created ASC`;

    // Request the relevant fields (include custom field ids when available)
    const fieldList = ["summary", "description", "labels"];
    if (acceptanceField) fieldList.push(acceptanceField);
    if (generatedTestCasesField) fieldList.push(generatedTestCasesField);

    const searchResp = await axios.post(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search/jql`,
      {
        jql,
        maxResults: 100,
        fields: fieldList,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    );

    const issues = searchResp.data.issues || [];
    const stories = issues.map((issue) => ({
      key: issue.key || "",
      summary: issue.fields?.summary || "",
      description: parseADF(issue.fields?.description),
      acceptanceCriteria: parseADF(
        acceptanceField ? issue.fields?.[acceptanceField] : null,
      ),
      generatedTestCases: parseADF(
        generatedTestCasesField
          ? issue.fields?.[generatedTestCasesField]
          : null,
      ),
      labels: issue.fields?.labels || [],
    }));

    res.json({ stories, acceptanceField, generatedTestCasesField });
  } catch (err) {
    console.error("Fetch stories error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch Jira stories" });
  }
});

router.post("/jira/generate-testcases", generateTestCasesController);

module.exports = router;
