let viewing = [];

const emptyQuery = {
    query: null,
    sort: {pagenum: 1},
    limit: 20,
    page: 0
}

let _browsingPage = 0;

function removeChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

window.myapi.on("showSearchThumbnails", (event, docs) => {
    let listParent = document.getElementById("searched-thumbnails");
    removeChildren(listParent);

    for (let i = 0; i < docs.length; ++i) {
        let thumb = document.createElement("img");
        thumb.src = docs[i]["thumbnail"];
        listParent.appendChild(thumb);
    }
});

window.onload = async (event) => {
    await window.myapi.find(emptyQuery);
}

document.getElementById("prevPage").addEventListener("click", async (event) => {
    _browsingPage -= 1;
    const query = queryBuilder();
    await window.myapi.find(query);
});

document.getElementById("nextPage").addEventListener("click", async (event) => {
    _browsingPage += 1;
    const query = queryBuilder();
    await window.myapi.find(query);
});

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

function tagQuerySeparator() {
    const keyword = document.getElementById("search-keyword").value.trim();
    return keyword.split(" ");
}

function queryBuilder() {
    const limit = getNumofListings();
    const order = getOrder();
    const priority = getOrderPriority();
    const tagQuery = tagQuerySeparator();

    let query = {
        query: null,
        limit: limit,
        sort: {[priority]: order},
        page: _browsingPage
    };
    
    if (tagQuery[0].trim().length > 0) {
        query["query"] = {$in: tagQuery};
    }

    return query;
}

document.getElementById("search-keyword").addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const query = queryBuilder();
        await window.myapi.find(query);
    }
});