const fs = require("glob");
const {BrowserWindow, dialog} = require("electron").remote;

document.querySelector("#import-button").addEventListener("click", () => {
    const win = BrowserWindow.getFocusedWindow();
    const directory = document.getElementById("#import-directory").nodeValue;
    
});