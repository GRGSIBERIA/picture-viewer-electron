const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myapi", {
    digest: async (text) => { await ipcRenderer.invoke("digest", text); },
    import: async (items) => { await ipcRenderer.invoke("import", items); }
});