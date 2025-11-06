// write a express webserver to serve the angular app
const express = require("express");
const path = require("path");
const logger = require("./utils/logger");
const cors = require("cors");

const drive = process.env.SystemDrive || "C:";
let baseDirectory = path.join(drive, "otn");

// Listen for messages from the main process (to receive IP)
process.on("message", (message) => {
  if (message.Event === "directory") {
    baseDirectory = message.Data.path;
    logger.info(`Content directory set to: ${contentDir}`);
  } else if (message.Event === "heartbeat") {
    process.send({ Event: "heartbeat", Data: "alive" });
  }
});

const app = express();
const port = 27078;

const webPath = path.join(__dirname, "../web/browser");

app.use(cors());

// Serve static files from the Angular app
app.use(express.static(webPath));

// add a route to get the config.json
app.get("/config", (req, res) =>
  res.sendFile(path.join(baseDirectory, "config.json"))
);

// add a route to get the config.json
app.get("/logo/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(baseDirectory, filename));
});

// Catch all other routes and return the index file
app.get("*", (req, res) => {
  res.sendFile(path.join(webPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  process.send({ Event: "health", Data: "OK" });
});
