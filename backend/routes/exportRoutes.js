const express = require("express");
const router = express.Router();
const exportToExcel = require("../controllers/exportExcelController");
const exportToJiraController = require("../controllers/exportToJiraController");

router.post("/export/excel", exportToExcel);
router.post("/export/jira", exportToJiraController);

module.exports = router;
