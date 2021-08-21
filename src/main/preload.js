const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myapi", {
    digest: async (text) => { await ipcRenderer.invoke("digest", text); }
});