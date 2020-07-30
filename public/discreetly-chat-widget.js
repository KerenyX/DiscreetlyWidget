var domain = "https://discreetly-chat-11.herokuapp.com/";

window.onload = () => {
    loadJsFiles();
    loadStyleFiles();
};

function loadStyleFiles() {
    loadStylesheet(`${domain}/css/tooltipster.bundle.min.css`);
    loadStylesheet("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    loadStylesheet(`${domain}/css/style.css`);
}

function loadJsFiles() {
    loadJsScript("https://code.jquery.com/jquery-3.5.1.min.js");
    loadJsScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/moment.min.js");
    loadJsScript("https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.31/moment-timezone.min.js");
    loadJsScript(`${domain}/socket.io/socket.io.js`);
    loadJsScript(`${domain}/js/chat.js`);
    loadJsScript(`${domain}/js/tooltipster.bundle.min.js`);
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
