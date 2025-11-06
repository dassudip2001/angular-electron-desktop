const { app, BrowserWindow, screen, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const { registerDirectories } = require("./utils/setting");
const logger = require("./utils/logger");
const { fork } = require("child_process");

let lastHeartbeatTime = Date.now();
const heartbeatInterval = 5000; // 5 seconds
const heartbeatTimeout = 10000; // 10 seconds (timeout if no heartbeat received)
let heartbeatCheckInterval;
let retryCount = 0;
const maxRetries = 5;

let splashWindow, mainWindow, serverProcess;

// function createSplashWindow() {
//   const { width, height } = screen.getPrimaryDisplay().workAreaSize;

//   splashWindow = new BrowserWindow({
//     width,
//     height,
//     fullscreen: true,
//     alwaysOnTop: true,
//     autoHideMenuBar: true,
//     backgroundColor: "#000000",
//     center: true,
//     resizable: false,
//     titleBarStyle: "hidden",
//     titleBarOverlay: true,
//     webPreferences: {
//       contextIsolation: true,
//       nodeIntegration: false,
//       devTools: false,
//     },
//   });

//   splashWindow.loadFile(path.join(__dirname, "../index.html"));

//   //splashWindow.webContents.openDevTools(); // Open DevTools

//   splashWindow.on("unresponsive", () => {
//     logger.warn("Main window is unresponsive.");
//     splashWindow.reload();
//   });

//   splashWindow.webContents.on(
//     "did-fail-load",
//     (event, errorCode, errorDescription) => {
//       logger.error(
//         `Failed to load content: ${errorDescription} (Code: ${errorCode})`
//       );
//     }
//   );

//   // Disable all keyboard events in the window
//   splashWindow.webContents.addListener("keydown", (event) => {
//     event.preventDefault(); // Prevents the default action of the key press
//   });

//   splashWindow.webContents.addListener("keypress", (event) => {
//     event.preventDefault(); // Prevents the default action of the key press
//   });

//   splashWindow.webContents.addListener("keyup", (event) => {
//     event.preventDefault(); // Prevents the default action of the key release
//   });
// }

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    fullscreen: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    backgroundColor: "#000000",
    center: true,
    resizable: false,
    titleBarStyle: "hidden",
    titleBarOverlay: true,

    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: false,
    },
  });

  mainWindow.loadURL("http://localhost:27078"); // Load the WebServer server URL

  // mainWindow.webContents.openDevTools(); // Open DevTools

  mainWindow.on("unresponsive", () => {
    logger.warn("Main window is unresponsive.");
    mainWindow.reload();
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      logger.error(
        `Failed to load content: ${errorDescription} (Code: ${errorCode})`
      );
    }
  );

  // Disable all keyboard events in the window
  mainWindow.webContents.addListener("keydown", (event) => {
    event.preventDefault(); // Prevents the default action of the key press
  });

  mainWindow.webContents.addListener("keypress", (event) => {
    event.preventDefault(); // Prevents the default action of the key press
  });

  mainWindow.webContents.addListener("keyup", (event) => {
    event.preventDefault(); // Prevents the default action of the key release
  });
}

function setupEventListeners() {
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on("before-quit", () => {
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill();
    }
  });
}

// Start the WebServer in a separate process
function startServer(baseDirectory) {
  if (retryCount >= maxRetries) {
    logger.error("Max retries reached for WebServer.");
    return;
  }

  logger.info("Starting WebServer...");
  serverProcess = fork(path.join(__dirname, "server.js"));

  // Send the Content Directory to the WebServer process
  serverProcess.send({ Event: "directory", Data: { path: baseDirectory } });

  // Handle messages from the WebServer process
  serverProcess.on("message", (message) => {
    const { Event, Data } = message;
    if (Event === "health") {
      // Close the splash screen and show the main window
      //   if (splashWindow) {
      //     splashWindow.close();
      //     splashWindow = null;
      //   }

      // Load the server content into the main window
      if (!mainWindow) {
        createMainWindow();
      }

      //mainWindow.loadURL("http://localhost:3000");
    }

    if (Event === "heartbeat") {
      lastHeartbeatTime = Date.now(); // Update last heartbeat time
      logger.info(`Its ${Data}`);
    }
  });

  serverProcess.on("exit", (code) => {
    logger.error(`WebServer process exited with code ${code}`);
    retryWebServer(baseDirectory);
  });

  serverProcess.on("error", (error) => {
    logger.error(`WebServer process error: ${error.stack}`);
    retryWebServer(baseDirectory);
  });

  startHeartbeatMonitoring(baseDirectory);
}

function startHeartbeatMonitoring() {
  heartbeatCheckInterval = setInterval(monitorHeartbeat, heartbeatInterval);
}

// monotoring the WebServer
function monitorHeartbeat(contentDir) {
  const timeSinceLastHeartbeat = Date.now() - lastHeartbeatTime;
  if (timeSinceLastHeartbeat > heartbeatTimeout) {
    logger.error("Heartbeat timeout. Restarting WebServer...");
    clearInterval(heartbeatCheckInterval); // Clear interval before restarting
    serverProcess.kill(); // Kill the current WebServer
    retryWebServer(contentDir); // Retry starting WebServer
  } else {
    serverProcess.send({ Event: "heartbeat" }); // Send heartbeat check
  }
}

// Retry logic
function retryWebServer(contentDir) {
  retryCount++;
  logger.warn(`Retrying WebServer (${retryCount}/${maxRetries})...`);
  const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with max 30 seconds
  const restartTimeout = setTimeout(() => {
    startServer(contentDir);
    clearTimeout(restartTimeout); // Clear timeout after starting
  }, retryDelay); // Retry after 5 seconds
}

ipcMain.on("quit-app", () => {
  app.quit();
});

app.whenReady().then(() => {
  //   createSplashWindow(); // Show the splash screen initially
  registerDirectories()
    .then(({ baseDirectory }) => {
      logger.info("App started successfully.");
      startServer(baseDirectory);
      setupEventListeners();
    })
    .catch((error) => {
      console.error("Error during directory setup:", error);
      app.quit(); // Quit the app if there's an error in setup
    });
});
