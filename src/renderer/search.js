let viewing = [];

window.myapi.on("show search thumbnails", (event, docs) => {
    let listParent = document.getElementById("thumbnail-listings");
    for (let i = 0; i < docs.length; ++i) {
        let thumb = document.createElement("img");
        thumb.src = docs[i]["thumbnail"];
        listParent.appendChild(thumb);
    }
});

document.getElementById("tab-search").addEventListener("click", (event) => {
    (async () => {
        await window.myapi.find({
            query: "",
            sort: {pagenum: 1},
            limit: 20,
            page: 0
        });
    })();
});
