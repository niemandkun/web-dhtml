httpRequest = new XMLHttpRequest();

window.onload = function() {
    ref(document.location.pathname);
}

window.onpopstate = function(e) {
    request("/api" + document.location.pathname, function(response) {
        updateContent(response.title, response.content);
    });
}

function ref(url) {
    request("/api" + url, function(response) {
        updateContent(response.title, response.content);
        pushHistoty(response.title, url);
    });
}

function request(url, callback) {
    hideNavigation();
    showSpinner();
    httpRequest.abort();
    httpRequest.onreadystatechange = handleResponse(callback);
    httpRequest.open('GET', url);
    httpRequest.send();
}

function handleResponse(callback) {
    return function() {

        var done = 4;

        if (httpRequest.readyState === done) {
            if (httpRequest.status === 0) {
                return;
            }

            if (httpRequest.status === 200) {
                response = JSON.parse(httpRequest.responseText);
            } else {
                response = createError(httpRequest.status);
            }

            callback(response);
            hideSpinner();
        }
    }
}

function createError(errorNumber) {
    var error = Object();

    error.title = "Error " + errorNumber+ " | nl";
    error.content = "<div class=error>Oops...<br/>An error "
              + errorNumber
              + " occured :(</div>"

    return error;
}

function pushHistoty(title, url) {
    if (history.pushState)
        history.pushState(null, title, url);
}

function updateContent(title, contentText) {
    content = getByClassName("content")[0];
    content.innerHTML = contentText;
    document.title = title;
}

function show(cls) {
    applyToAll(cls, function(e) { e.style.display = "flex"; });
}

function hide(cls) {
    applyToAll(cls, function(e) { e.style.display = "none"; });
}

function showSpinner() {
    hide("content"); show("spinner");
}

function hideSpinner() {
    hide("spinner"); show("content");
}