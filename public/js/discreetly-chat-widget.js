window.onload = () => {
    loadJsFiles();
    loadStyleFiles();
};

function loadStyleFiles() {
    loadStylesheet("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    loadStylesheet(`${process.env.DOMAIN}/css/style.min.css`);
}

function loadJsFiles() {
    loadJsScript("https://code.jquery.com/jquery-3.5.1.min.js");
    loadJsScript(`${process.env.DOMAIN}/langs/${process.env.LANGUAGE}.js`);
    loadJsScript(`${process.env.DOMAIN}/settings/${process.env.SETTINGS_FILE}.js`);
    loadJsScript(`${process.env.DOMAIN}/socket.io/socket.io.js`);
    loadJsScript(`${process.env.DOMAIN}/chat.js`);
}

function loadStylesheet(url) {
    let link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    let entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(link, entry);
}

function loadJsScript(src) {
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;

    let entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(script, entry);
}
