var standby = []

document.getElementById('import-button').addEventListener('change', event => {
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
                        data.push({
                            "result": e.target.result
                        });
                        progress.setAttribute('value', i);
                    }
                })(standby);
                reader.readAsDataURL(file);
            default:
                break;
        }
    }
    progress.setAttribute('value', file_count);
});