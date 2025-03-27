import { app, BrowserWindow,screen } from 'electron';
import path from 'node:path';
import url from 'node:url'; // Import the url module
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}
// Keep references to window objects to prevent garbage collection
let mainWindow: BrowserWindow | null = null;
let loadingWindow: BrowserWindow | null = null;

const createLoadingWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  loadingWindow = new BrowserWindow({
    width: width, // Adjust size as needed
    height: height, // Adjust size as needed
    frame: false, // No window frame (title bar, etc.)
    resizable: false,
    transparent: false, // Set to true if loading.html has transparent background
    alwaysOnTop: true,
    titleBarOverlay: true, // Hide title bar
    titleBarStyle:"hidden",
    webPreferences: {
        // No nodeIntegration or contextIsolation needed for a simple static page
    },
  });


  loadingWindow.setResizable(false);
  const indexPath2 = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/loading.html`);
  console.log(`Loading PROD file: ${indexPath2}`);
  

  const loadingPagePath = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/loading.html`); // Adjust path if loading.html is elsewhere
  loadingWindow.loadURL(url.format({
    pathname: loadingPagePath,
    protocol: 'file:',
    slashes: true
  }));


  loadingWindow.on('closed', () => {
    loadingWindow = null; // Clean up reference
  });

  // Optional: Show immediately
  // loadingWindow.show(); // No need if created visible by default
};

const createMainWindow = () => {
  // Create the main browser window, but don't show it yet.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width, // Your desired main window width
    height: height, // Your desired main window height
    show: false, // *** Important: Don't show until ready ***
    titleBarOverlay: true, // Hide title bar
    titleBarStyle:"hidden",
    webPreferences: {
      // Make sure preload path is correct relative to __dirname in built app
      // In Forge/Vite template, __dirname usually points to /.vite/build in dev
      // and app.asar/.vite/build in production. Preload is often copied alongside.
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Recommended security
      nodeIntegration: false, // Recommended security
      // Add other preferences if needed
    },
  });

  // --- Load your Angular App ---
  // Check if VITE_DEV_SERVER_URL is defined (development)
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    console.log(`Loading DEV URL: ${MAIN_WINDOW_VITE_DEV_SERVER_URL}`);
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // Production: Load the index.html file from your Angular build output
    // Adjust the path based on your build output structure and Forge config.
    // The original path points relative to __dirname, which might be inside .vite/build
    // It correctly goes up one level (`../`) and then into `renderer/vite_window_name/index.html`
    const indexPath = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);
    console.log(`Loading PROD file: ${indexPath}`);
    mainWindow.loadFile(indexPath);
  }
  // --- End Loading Angular App ---


  // *** Important: Wait for the main window content to be ready ***
  mainWindow.once('ready-to-show', () => {
    console.log('Main window ready-to-show event fired.');
    setTimeout(() => {
      console.log('Timeout fired');
      
      if (loadingWindow) {
        loadingWindow.close(); // Close the loading window
        loadingWindow.destroy();
      }
      mainWindow.show(); // Now show the main window smoothly
    },3000);

    // Optionally Open the DevTools *after* showing
    // mainWindow.webContents.openDevTools();
  });


  mainWindow.on('closed', () => {
    mainWindow = null; // Clean up reference
  });

  // You might want to open DevTools conditionally or based on environment
  if (process.env.NODE_ENV !== 'production') {
       mainWindow.webContents.openDevTools();
  }
};

// --- App Lifecycle ---

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  console.log('App ready event fired.');
  createLoadingWindow(); // Create the loading screen first
  createMainWindow();   // Then create the main window (hidden) and start loading
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log('All windows closed, quitting app.');
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X, re-create the main window when the dock icon is clicked
  // and there are no other windows open. Don't show loading screen again.
  if (BrowserWindow.getAllWindows().length === 0) {
    console.log('App activated, creating main window.');
    // Only create main window if it doesn't exist
    if (!mainWindow) {
        createMainWindow();
    } else {
        // If it exists but is somehow hidden, show it (edge case)
        mainWindow.show();
    }
  }
});

// --- End App Lifecycle ---

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.