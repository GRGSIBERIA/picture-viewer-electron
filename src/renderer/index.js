

document.getElementById('import-button').addEventListener('change', event => {
    for (let i = 0; i < event.target.files.length; ++i) {
        let file = ev.target.files[i];

        let relativePath = file.webkitRelativePath;

        console.log(relativePath);
    }
});