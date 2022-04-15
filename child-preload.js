// Preload (Isolated World)
const { contextBridge, ipcRenderer } = require('electron')
let {searchEngineURL} = require('./global-data')

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('afterbegin', `
  <div style="width:100%;heigth:0.5vh;background:red;">
    <div class="button" id="min-button">
      <svg width="11" height="1" viewBox="0 0 11 1">
        <path d="m11 0v1h-11v-1z" stroke-width=".26208" />
      </svg>
    </div>
    <div class="button" id="max-button">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="m10-1.6667e-6v10h-10v-10zm-1.001 1.001h-7.998v7.998h7.998z" stroke-width=".25" />
      </svg>
    </div>
    <div class="button" id="restore-button">
      <svg width="11" height="11" viewBox="0 0 11 11">
        <path
          d="m11 8.7978h-2.2021v2.2022h-8.7979v-8.7978h2.2021v-2.2022h8.7979zm-3.2979-5.5h-6.6012v6.6011h6.6012zm2.1968-2.1968h-6.6012v1.1011h5.5v5.5h1.1011z"
          stroke-width=".275" />
      </svg>
    </div>
    <div class="button" id="close-button">
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path
          d="m6.8496 6 5.1504 5.1504-0.84961 0.84961-5.1504-5.1504-5.1504 5.1504-0.84961-0.84961 5.1504-5.1504-5.1504-5.1504 0.84961-0.84961 5.1504 5.1504 5.1504-5.1504 0.84961 0.84961z"
          stroke-width=".3" />
      </svg>
    </div>
  </div>
  <script>
  // Make minimise/maximise/restore/close buttons work when they are clicked
  document.getElementById('min-button').addEventListener("click", event => {
      window.electron.winMinimize()
  });

  document.getElementById('max-button').addEventListener("click", event => {
      window.electron.winMaximize()
      document.body.classList.add('maximized');
  });

  document.getElementById('restore-button').addEventListener("click", event => {
      window.electron.winUnMaximize()
      document.body.classList.remove('maximized');
  });

  document.getElementById('close-button').addEventListener("click", event => {
      window.electron.winClose()
  });
  </script>
  `);
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
