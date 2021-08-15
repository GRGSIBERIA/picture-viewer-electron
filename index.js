'use strict';

const {app, Menu, BrowserWindow} = require("electron");

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

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// Electronの初期化完了後に実行
app.on('ready', function() {
    // メイン画面の表示。ウィンドウの幅、高さを指定できる
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/public/index.html');

    // ウィンドウが閉じられたらアプリも終了
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});