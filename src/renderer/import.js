var standby = []
var importedThumbnails = []
var importedCount = 0;
var fileCount = 0;

async function sha256(text) {
    const uint8 = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', uint8);
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, '0')).join('');
}

function removeChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

document.getElementById('import-button').addEventListener("change", event => {
    importedThumbnails = []
    standby = []

    const files = event.target.files;
    const file_count = files.length;
    importedCount = 0;
    fileCount = files.length;
    
    let progress = document.getElementById('import-progress');
    let importLog = document.getElementById('import-log');

    progress.setAttribute('max', file_count - 1);
    progress.setAttribute('value', 0);

    removeChildren(document.getElementById("import-log"));
    removeChildren(document.getElementById("imported-thumbnails"));

    for (let i = 0; i < file_count; ++i) {
        const file = files[i];

        const relativePath = file.webkitRelativePath;

        switch (file.type) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
                let insertElement = document.createElement("p");
                let insertText = document.createTextNode(relativePath);
                insertElement.appendChild(insertText);
                importLog.appendChild(insertElement);

                const reader = new FileReader();
                reader.onload = (function(data) { 
                    return function(e) {
                        let img = new Image();
                        let canvas = document.createElement("canvas");
                        let context = canvas.getContext('2d');

                        img.onload = function(event) {
                            const factor = 128 / Math.max(this.width, this.height);
                            const destW = this.width * factor;
                            const destH = this.height * factor;
                            canvas.width = destW;
                            canvas.height = destH;
                            context.drawImage(this, 0, 0, this.width, this.height, 0, 0, destW, destH);
                            const thumbnail = canvas.toDataURL();

                            let record = {
                                original: e.target.result,
                                thumbnail: thumbnail,
                                path: relativePath
                            };

                            // 非同期処理が挟まるのでここでまとめてロックをかける
                            navigator.locks.request("add record", async () => {
                                record["original-digest"] = await sha256(e.target.result);
                                record["thumbnail-digest"] = await sha256(thumbnail);
                                data.push(record);

                                const num = Number(progress.getAttribute('value'));
                                progress.setAttribute('value', num + 1);

                                let pictureTag = document.createElement("picture");
                                let thumbTag = document.createElement("img");
                                thumbTag.src = record["thumbnail"];
                                pictureTag.appendChild(thumbTag)
                                thumbTag.setAttribute("class", "thumb")

                                let thumbParent = document.getElementById("imported-thumbnails");
                                thumbParent.appendChild(pictureTag);

                                importedCount++;
                            });
                        }
                        img.src = e.target.result;
                    }
                })(standby);
                reader.readAsDataURL(file);
            default:
                break;
        }
    }
});

document.getElementById("import-database").addEventListener("click", event => {
    if (fileCount >= importedCount) {
        // データベースへの登録準備
        for (let i = 0; i < standby.length; ++i)
        {
            const filename = standby[i]["path"].split("/").pop();
            const re = /[0-9]+/g;
            let pagenum = null;
            const matches = filename.split(".").shift().match(re);
            if (matches != null) {
                pagenum = Number(matches.pop());
            }

            standby[i]["attributes"] = {
                path: standby[i]["path"],
                filename: filename,
                pagenum: pagenum
            }
            let tags = standby[i]["path"].split("/");
            tags.pop();
            standby[i]["tags"] = tags;

            // ここまでデータベースへの追記準備
        }

        // standbyの中身を整理できたものとして、データベースに追記する
        (async () => {
            await window.myapi.import(standby);
            standby = [];
            fileCount = 0;
            importedCount = -1;
            importedThumbnails = [];
            let thumbs = document.getElementById("imported-thumbnails");
            removeChildren(thumbs);
        })();
    }
});