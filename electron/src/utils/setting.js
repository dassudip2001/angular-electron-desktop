const fs = require("fs");
const path = require("path");

// function register directories
async function registerDirectories() {
  try {
    const drive = process.env.SystemDrive || "C:";
    const baseDirectory = path.join(drive, "otn");

    if (!fs.existsSync(baseDirectory)) {
      await fs.promises.mkdir(baseDirectory, { recursive: true });
      console.log(`Created base directory at: ${baseDirectory}`);
    }

    const configPath = path.join(baseDirectory, "config.json");
    const defaultConfig = {
      apiHost: "http://localhost:8080",
    };
    if (!fs.existsSync(configPath)) {
      await fs.promises.writeFile(
        configPath,
        JSON.stringify(defaultConfig, null, 2),
        "utf8"
      );
    }

    const logDir = path.join(baseDirectory, "logs");
    if (!fs.existsSync(logDir)) {
      await fs.promises.mkdir(logDir, { recursive: true });
      console.log(`Created logs directory at: ${logDir}`);
    }

    // const contentDir = path.join(baseDirectory, "content");
    // if (!fs.existsSync(contentDir)) {
    //   fs.promises.mkdir(contentDir, { recursive: true });
    //   console.log(`Created content directory at: ${contentDir}`);
    // }
    return { baseDirectory, logDir }; // Resolve after setup is complete
  } catch (error) {
    console.log(`Error in registerDirectories: ${error.message}`);
    throw error; // Reject with the error for proper handling
  }
}

// export the registerDirectories function
module.exports = {
  registerDirectories,
};
