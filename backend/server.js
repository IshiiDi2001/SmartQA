const express = require("express");
const cors = require("cors");

const jiraRoutes = require("./routes/jiraRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", jiraRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
