var standby = []

async function sha256(text) {
    const uint8 = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', uint8);
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, '0')).join('');
}

document.getElementById('import-button').addEventListener("change", event => {
    const files = event.target.files;
    const file_count = files.length;
    
    let progress = document.getElementById('import-progress');
    let importLog = document.getElementById('import-log');

    progress.setAttribute('max', file_count);
    progress.setAttribute('value', 0);

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
                                record["thumbnail-record"] = await sha256(thumbnail);
                                data.push(record);
                                progress.setAttribute('value', i + 1);
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
