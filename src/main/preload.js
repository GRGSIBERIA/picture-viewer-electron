const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myapi", {
    digest: async (text) => { await ipcRenderer.invoke("digest", text); },
    import: async (items) => { await ipcRenderer.invoke("import", items); },
    find: async (param) => { await ipcRenderer.invoke("find", param); },
    on: (channel, callback) => ipcRenderer.on(channel, (event, argv)=>callback(event, argv))
});