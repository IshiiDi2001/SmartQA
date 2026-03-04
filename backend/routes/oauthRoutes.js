const express = require("express");
const axios = require("axios");
const router = express.Router();

const CLIENT_ID = process.env.ATL_CLIENT_ID;
const CLIENT_SECRET = process.env.ATL_CLIENT_SECRET;
const REDIRECT_URI = process.env.ATL_REDIRECT_URI;

// Step 1: Redirect user to Atlassian for auth
router.get("/connect", (req, res) => {
  const scope = encodeURIComponent(
    "read:jira-user read:jira-work write:jira-work",
  );
  const url =
    `https://auth.atlassian.com/authorize` +
    `?audience=api.atlassian.com` +
    `&client_id=${CLIENT_ID}` +
    `&scope=${scope}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&prompt=consent`;

  res.redirect(url);
});

// Step 2: OAuth callback
router.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Authorization code missing");

  try {
    const tokenResponse = await axios.post(
      "https://auth.atlassian.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      },
      { headers: { "Content-Type": "application/json" } },
    );

    const { access_token } = tokenResponse.data;

    // Redirect to frontend with access token in URL
    res.redirect(
      `https://smartqa-pe5h.onrender.com/?access_token=${access_token}`,
    );
  } catch (err) {
    console.error("OAuth callback error:", err.message);
    res.status(500).send("Failed to get access token");
  }
});

module.exports = router;
