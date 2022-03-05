(function () {
    const urlsEl = document.getElementById("fetch-urls");

    const originalFetch = window.fetch;
    window.fetch = function () {
        return originalFetch.apply(this, arguments)
            .then((res) => {
                console.log("fetch url", res.url);
                urlsEl.innerHTML += `<li>${res.url}</li>`;
                return res;
            })
            .catch((err) => { });

    }
})();