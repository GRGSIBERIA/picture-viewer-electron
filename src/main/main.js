'use strict';

const {app, Menu, BrowserWindow, ipcMain} = require("electron");
const Datastore = require('nedb');
const path = require("path");
const crypto = require('crypto');

var db = new Datastore({
    filename: 'store.db',
    autoload: true
});

// インデックスを張る
db.ensureIndex({fieldName: "original-digest", unique: true}, err => {});
db.ensureIndex({fieldName: "thumbnail-digest", unique: true}, err => {});

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
        window.webContents.openDevTools();
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

ipcMain.handle("digest", (event, text) => {
    const hash = crypto.createHash('sha256').update(text, 'utf8').digest('hex');
    return hash;
});

ipcMain.handle("import", async (event, items) => {
    for (let i = 0; i < items.length; ++i) {
        db.findOne({"original-digest": items[i]["original-digest"]}, (err, doc) => {
            if (doc === null) {
                db.insert(items[i], (err) => {
                    if (err !== null) {
                        console.log("duplicated :", items[i]["original-digest"]);
                    }
                });
            }
        });
    }
});

ipcMain.handle("find", async (event, param) => {
    /*
    param's format
    {
        "query": str,
        "sort": {pagenum: 1},    // default
        "limit": 20,
        "page": 0
    }
    */
    const keywords = param["query"].split(" ");

    const sorting = param["sort"];
    /* ex. {pagenum: 1}, {filename: 1}, {vote: 1} */

    const limit = param["limit"];
    const page = param["page"];
    // pagination = limit * page;

    console.log(param);
    db.count({}, (err, count) => {
        console.log(count);
    });

    let returnDocs = [];

    if (keywords.length > 1) {
        db.find({tags: {$in: keywords}}).sort(sorting).skip(page * limit).limit(limit).exec((err, docs) => {
            // 得にエラーがなければレンダラーに結果を返す
            if (err !== null) {
                // search.jsに送る
                win.webContents.send("show search thumbnails", docs);
            } else {
                console.log(err);
            }
        });
    } else {
        db.find({}).sort(sorting).skip(page * limit).limit(limit).exec((err, docs) => {
            if (err !== null) {
                win.webContents.send("show search thumbnails", docs);
            } else {
                console.log(err);
            }
        });
    }

    return returnDocs;
});