document.querySelector("#import-button").addEventListener("click", async () => {
    const fs = await window.api.require("fs");

    const directory = document.getElementById("#import-directory").nodeValue;
    
});