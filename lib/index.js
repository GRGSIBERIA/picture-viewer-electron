const fs = require("fs");
const {BrowserWindow, dialog} = require("electron").remote;

document.querySelector("#import-button").addEventListener("click", () => {
    const win = BrowserWindow.getFocusedWindow();
});