const ExcelJS = require("exceljs");

const exportToExcel = async (req, res) => {
  try {
    const { testCases } = req.body;

    if (!testCases || testCases.length === 0) {
      return res.status(400).json({
        message: "No test cases provided",
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test Cases");

    worksheet.columns = [
      { header: "Story Key", key: "storyKey", width: 15 },
      { header: "Story Summary", key: "storySummary", width: 30 },
      { header: "Test Case ID", key: "tcId", width: 15 },
      { header: "Title", key: "title", width: 40 },
      { header: "Steps", key: "steps", width: 60 },
      { header: "Expected Result", key: "expected", width: 40 },
    ];

    testCases.forEach((story) => {
      story.testCases.forEach((tc) => {
        worksheet.addRow({
          storyKey: story.storyKey,
          storySummary: story.storySummary,
          tcId: `TC-${tc.id}`,
          title: tc.title,
          steps: tc.steps.join("\n"),
          expected: tc.expectedResult,
        });
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=test-cases.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel Export Error:", err);
    res.status(500).json({ message: "Excel export failed" });
  }
};

module.exports = exportToExcel;
