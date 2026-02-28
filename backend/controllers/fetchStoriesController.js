const fetchStories = require("../services/fetchStories");

const fetchStoriesController = async (req, res) => {
  try {
    const config = req.body;

    if (!config) {
      return res.status(400).json({
        message: "Jira configuration is required",
      });
    }

    const stories = await fetchStories(config);

    res.status(200).json({
      success: true,
      stories,
    });
  } catch (error) {
    console.error("Fetch Stories Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stories",
      error: error.message,
    });
  }
};

module.exports = fetchStoriesController;
