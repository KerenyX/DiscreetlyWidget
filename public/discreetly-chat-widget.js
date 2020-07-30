(function() {
    let jQuery; // Localize jQuery variable

    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.5.1') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type","text/javascript");
        script_tag.setAttribute("src", "https://code.jquery.com/jquery-3.5.1.min.js");

        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () { // For old versions of IE
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                scriptLoadHandler();
            }};
        } else { // Other browsers
            script_tag.onload = scriptLoadHandler;
        }

        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        main();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        main(); // Call our main function
    }

    /******** Our main function ********/
    function main() { 
        jQuery(document).ready(function($) { 
            loadStyleFiles();
            createWidgetHtml();
            loadJsFiles();
        });
    }
})(); // We call our anonymous function immediately

function loadStyleFiles() {
    loadStylesheet("https://discreetly-test.herokuapp.com/css/style.css");
    loadStylesheet("https://discreetly-test.herokuapp.com/css/tooltipster.bundle.min.css");
    loadStylesheet("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
}

function loadJsFiles() {
    loadJsScript("https://code.jquery.com/jquery-3.5.1.min.js");
    loadJsScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/moment.min.js");
    loadJsScript("https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.31/moment-timezone.min.js");
    loadJsScript("https://discreetly-test.herokuapp.com/socket.io/socket.io.js");
    loadJsScript("https://discreetly-test.herokuapp.com/js/tooltipster.bundle.min.js");
    loadJsScript("https://discreetly-test.herokuapp.com/js/chat.js");
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

function createWidgetHtml() {
    const chatHtml =
        '<div id="chat-container" class="none fixed">' +
            '<div id="sound"></div>' +
            '<section id="chat-ended-overlay" class="chat-overlay none full-width">' +
                '<div id="chat-ended-button">' +
                    "<p> השיחה הסתיימה<br> לחץ כדי לסגור את הצ'אט</p>" +
                '</div>' +
            '</section>' +
            '<section id="chat-header" class="full-width">' +
                '<div class="flex">' +
                    '<i class="fa fa-comment-o white"></i>' +
                    '<p id="header-text" class="rtl">מתחבר...</p>' +
                '</div>' +
                '<div>' +
                    '<i class="fa fa-chevron-down pointer white"></i>' +
                    '<i class="fa fa-chevron-up pointer white"></i>' +
                    '<i class="fa fa-times pointer white"></i>' +
                '</div>' +
            '</section>' +
            '<section id="chat-body">' +
                '<section id="chat-content">' +
                    '<div id="chat-main" class="rtl">' +
                        '<span id="welcome-time" class="time-general"></span>' +
                        "<p> סגירת הצ'אט תמחק את כל ההודעות.<br></br> פתיחה מחדש תתחיל צ'אט עם נציג אחר." +
                        '</p><br>' +
                        '<p> אחד הנציגים שלנו יהיה איתך בקרוב.<br> בינתיים, כמה מקורות רלוונטיים:<br><br>' +
                        '<iframe width="290" src="https://www.youtube.com/embed/wpZy4I0Meho" frameborder="0"' +
                            'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
                        '</p>' +
                        '<span id="chat-start-time" class="chat-started-text time-general"></span>' +
                        '<p class="chat-started-text">שלום. אני מתנדב/ת ממרכז הסיוע. אפשר להתחיל לשוחח</p>' +
                        '<ul id="chat-history"></ul>' +
                    '</div>' +
                    '<div id="waiting-msg">' +
                        '<p>...הנציג/ה מקליד/ה</p>' +
                    '</div>' +
                '</section>' +
                '<section id="chat-message-container" class="full-width">' +
                    '<form action="#" id="chat-form" class="flex">' +
                        '<i class="fa fa-plus fa-lg button-color-disabled tooltip"' +
                            'title="אי אפשר לפתוח את התפריט עד שהנציג/ה עונה"></i>' +
                        '<i class="fa fa-times fa-lg pointer button-color-enabled none"></i>' +
        
                        '<input id="chat-message" class="rtl tooltip" autocomplete="off" placeholder="הקלידו טקסט כאן"' +
                            'title="אי אפשר לשלוח הודעה עד שהנציג/ה עונה"/>' +
                        '<i class="fa fa-arrow-right fa-lg button-color-disabled tooltip"' +
                            'title="אי אפשר לשלוח הודעה עד שהנציג/ה עונה"></i>' +
                    '</form>' +
                '</section>' +
                '<section id="menu-container" class="none">' +
                    '<div id="menu-content" class="flex">' +
                        '<article id="menu-end-conversation">' +
                            '<div><i class="fa fa-ban fa-lg"></i></div>' +
                            '<p>סיום שיחה</p>' +
                        '</article>' +
                        '<article id="menu-send-email">' +
                            '<div><i class="fa fa-envelope-o fa-lg"></i></div>' +
                            '<p>שליחת תמליל שיחה באי מייל</p>' +
                        '</article>' +
                        '<article id="menu-print-chat">' +
                            '<div><i class="fa fa-print fa-lg"></i></div>' +
                            '<p>הדפסת תמליל שיחה</p>' +
                        '</article>' +
                        '<article id="menu-volume">' +
                            '<div>' +
                                '<i class="fa fa-volume-off fa-lg"></i>' +
                                '<i class="fa fa-volume-up fa-lg none"></i>' +
                            '</div>' +
                            '<p>השתקת התראות</p>' +
                        '</article>' +
                    '</div>' +
                    '<div id="menu-footer">' +
                        '<article></article>' +
                    '</div>' +
                '</section>' +
            '</section>' +
        '</div>';

    var chatContainer = document.getElementById("discreetly-chat-widget-container");
    chatContainer.innerHTML = chatHtml;
}
