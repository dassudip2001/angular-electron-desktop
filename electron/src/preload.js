// preload.js

const { contextBridge, ipcRenderer } = require("electron");

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector, text) => {
//       const element = document.getElementById(selector)
//       if (element) element.innerText = text
//     }

//     for (const dependency of ['chrome', 'node', 'electron']) {
//       replaceText(`${dependency}-version`, process.versions[dependency])
//     }
//   })

// Expose a subset of Electron APIs to the renderer process
contextBridge.exposeInMainWorld("app", {
  getConfig: () => ipcRenderer.invoke("get-config"),
  onConfigUpdated: (callback) =>
    ipcRenderer.on("config-updated", (event, newConfig) => callback(newConfig)),
  quit: (url) => {
    console.log("Work...");
    ipcRenderer.send("quit-app", url);
  },
});
