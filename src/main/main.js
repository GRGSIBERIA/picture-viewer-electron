'use strict';

const {app, Menu, BrowserWindow, ipcMain} = require("electron");
const path = require("path");

const isDevelopment = process.env.NODE_ENV !== 'production';

const template = Menu.buildFromTemplate([
    {
        label: "ファイル",
        submenu: [
            { id: "close-window", label: "閉じる"}
        ]
    },
    {
        label: "表示",
        submenu: [
            { id: "import-tab", label: "読み込み"},
            { id: "search-tab", label: "検索"},
            { id: "view-tab", label: "閲覧"},
            { id: "collage-tab", label: "コラージュ"},
            //{ type: "separator"}
        ]
    }
]);
Menu.setApplicationMenu(template);

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

function createMainWindow() {
    const window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        },
        width: 800,
        height: 600
    });

    if (isDevelopment) {
        //window.webContents.openDevTools();
    }
  
    if (isDevelopment) {
        window.loadURL('file://' + __dirname + '/../renderer/index.html');
    }
    else {
        window.loadURL(formatUrl({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        }));
    }
  
    window.on('closed', () => {
        mainWindow = null
    });
  
    window.webContents.on('devtools-opened', () => {
        window.focus()
        setImmediate(() => {
            window.focus()
        })
    });
  
    return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
  
app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});
  
// create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow()
});

ipcMain.handle("require", (event, component) => {
    return require(component);
});