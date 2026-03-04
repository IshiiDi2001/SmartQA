require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");

const oauthRoutes = require("./routes/oauthRoutes");
const jiraRoutes = require("./routes/jiraRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/oauth", oauthRoutes);
app.use("/api", jiraRoutes);
app.use("/api", require("./routes/exportRoutes"));

app.get("/", (req, res) => res.send("Backend Running"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
