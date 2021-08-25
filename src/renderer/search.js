let viewing = [];

const emptyQuery = {
    query: null,
    sort: {pagenum: 1},
    limit: 20,
    page: 0
}

window.myapi.on("showSearchThumbnails", (event, docs) => {
    let listParent = document.getElementById("searched-thumbnails");
    for (let i = 0; i < docs.length; ++i) {
        let thumb = document.createElement("img");
        thumb.src = docs[i]["thumbnail"];
        listParent.appendChild(thumb);
    }
});

window.onload = async (event) => {
    await window.myapi.find(emptyQuery);
}

function getNumofListings() {
    const elem = document.getElementById("numof-listings");
    return Number(elem.value);
}

function getOrder() {
    const elem = document.getElementById("listing-order");
    return Number(elem.value);
}

function getOrderPriority() {
    const elem = document.getElementById("order-priority");
    return elem.value;
}

document.getElementById("search-keyword").addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const limit = getNumofListings();
        const order = getOrder();
        const priority = getOrderPriority();
        const param = {
            limit: limit,
            
        }
    }
});