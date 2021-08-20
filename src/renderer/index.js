var standby = []

async function sha256(text) {
    const uint8 = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', uint8);
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, '0')).join('');
}

function getThumbnail(sourceURI) {
    let img = new Image();
    img.src = sourceURI;
    const factor = 128 / Math.max(img.width, img.height);
    let canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    let context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, img.width / factor, img.height / factor);
    return canvas.toDataURL();
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
                        const thumbnail = getThumbnail(e.target.result);
                        let record = {
                            original: e.target.result,
                            thumbnail: thumbnail,
                            path: relativePath
                        };

                        (async () => {
                            record["original-digest"] = await sha256(e.target.result);
                            record["thumbnail-record"] = await sha256(thumbnail);
                            data.push(record);
                            progress.setAttribute('value', i + 1);
                        })();
                    }
                })(standby);
                reader.readAsDataURL(file);
            default:
                break;
        }
    }
});
