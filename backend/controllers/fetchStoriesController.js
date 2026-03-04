const fetchStoriesService = require("../services/fetchStories");

const fetchStoriesController = async (req, res) => {
  try {
    const { accessToken, projectKey } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Access token required" });
    }

    if (!projectKey) {
      return res.status(400).json({ message: "Project key required" });
    }

    const { stories, acceptanceField, generatedTestCasesField } =
      await fetchStoriesService({
        accessToken,
        projectKey,
      });

    res.status(200).json({
      success: true,
      stories,
      acceptanceField,
      generatedTestCasesField,
    });
  } catch (err) {
    console.error("Fetch Stories Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stories",
    });
  }
};

module.exports = fetchStoriesController;
