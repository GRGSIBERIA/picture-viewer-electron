const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myapi", {
    import: async (items) => { await ipcRenderer.invoke("import", items); },
    find: async (param) => { await ipcRenderer.invoke("find", param); },
    showSearchThumbnails: (callback) => { ipcRenderer.showSearchThumbnails((event, argv) => callback(argv)); },

    on: (channel, callback) => ipcRenderer.on(channel, (event, argv)=>callback(event, argv))
});