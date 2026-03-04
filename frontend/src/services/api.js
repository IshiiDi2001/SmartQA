import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Redirect user to Jira OAuth
export const connectJira = () => {
  window.location.href = `${BASE_URL}/oauth/connect`;
};

// Fetch stories from backend
export const fetchStories = async (
  accessToken,
  projectKey,
  acceptanceField,
) => {
  const res = await axios.post(`${BASE_URL}/fetch-stories`, {
    accessToken,
    projectKey,
    acceptanceField,
  });
  return res.data.stories;
};

// Generate test cases using Groq AI
export const generateTestCases = async (stories) => {
  const res = await axios.post(`${BASE_URL}/generate-testcases`, { stories });
  return res.data.testCases;
};

// Push test cases back to Jira
export const pushTestCases = async (accessToken, testCases, testCaseField) => {
  const res = await axios.post(`${BASE_URL}/push-testcases`, {
    accessToken,
    testCases,
    testCaseField,
  });
  return res.data;
};
