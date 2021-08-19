

document.getElementById('import-button').addEventListener('change', event => {
    const file_count = event.target.files.length;
    let progress = document.getElementById('import-progress');

    progress.setAttribute('max', file_count);
    progress.setAttribute('value', 0);

    for (let i = 0; i < file_count; ++i) {
        progress.setAttribute('value', i);

        let file = event.target.files[i];

        let relativePath = file.webkitRelativePath;
    }
    progress.setAttribute('value', file_count);
});