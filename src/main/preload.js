const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myapi", {
    require: async (component) => { await ipcRenderer.invoke("require", data); }
});