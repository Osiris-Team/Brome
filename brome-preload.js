// Preload (Isolated World)
const { contextBridge, ipcRenderer } = require('electron')
let {searchEngineURL} = require('./global-data')

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld(
  'electron',
  {
    winMinimize: () => ipcRenderer.send('child-list-change'),
    winMaximize: () => ipcRenderer.send('win-maximize'),
    winUnMaximize: () => ipcRenderer.send('win-unmaximize'),
    winClose: () => ipcRenderer.send('win-close'),
    childWinOpen: (url) => ipcRenderer.send('child-win-open', url),
    childWinClose: (winIndex) => ipcRenderer.send('child-win-close', winIndex),
    searchEngineURL: searchEngineURL
  }
)
