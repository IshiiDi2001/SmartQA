require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");

const oauthRoutes = require("./routes/oauthRoutes");
const jiraRoutes = require("./routes/jiraRoutes"); // fetch/generate/push
const exportRoutes = require("./routes/exportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/oauth", oauthRoutes);
app.use("/api", jiraRoutes);
app.use("/api", exportRoutes);
app.use("/api", require("./routes/exportRoutes"));

app.get("/", (req, res) => res.send("Backend Running ✅"));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000"),
);
