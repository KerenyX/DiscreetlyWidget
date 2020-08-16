window.onload = () => {
    loadJsFiles();
    loadStyleFiles();
};

function loadStyleFiles() {
    loadStylesheet(`${process.env.DOMAIN}/css/tooltipster.bundle.min.css`);
    loadStylesheet("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    loadStylesheet(`${process.env.DOMAIN}/css/style.css`);
}

function loadJsFiles() {
    loadJsScript("https://code.jquery.com/jquery-3.5.1.min.js");
    loadJsScript("https://unpkg.com/i18next/i18next.js");
    loadJsScript("https://unpkg.com/i18next-xhr-backend/i18nextXHRBackend.js");
    loadJsScript(`${process.env.DOMAIN}/socket.io/socket.io.js`);
    loadJsScript(`${process.env.DOMAIN}/chat.js`);
}

function loadStylesheet(url) {
    let link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    var entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(link, entry);
}

function loadJsScript(src) {
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;

    var entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(script, entry);
}
