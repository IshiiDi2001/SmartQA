const router = require("express").Router();

const fetchStories = require("../controllers/fetchStoriesController");

const generate = require("../controllers/generateTestCasesController");

const push = require("../controllers/pushTestCasesController");

router.post("/fetch-stories", fetchStories);
router.post("/generate-testcases", generate);
router.post("/push-testcases", push);

module.exports = router;
