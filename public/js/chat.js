class Chat {
    constructor(socket) {
        this.socket = socket;
        this.isAssigned = false;
        this.isTyping = false;
        this.volunteerIsTyping = false;
        this.volume = settings.notificationDefault;
        this.chatDisabled = false;
    }

    openChat() {
        if (this.chatDisabled) {
            return;
        }

        const time = getCurrentIsraelTime();
        $('#welcome-time').text(time);

        $("#chat-container").css("display", "block");
        $("#open-chat-button").css("display", "none");
    }
    closeChat() {
        $("#chat-container").css("display", "none");
        $("#open-chat-button").css("display", "block");

        location.reload();
    }
    minimizeChat() {
        if (this.chatDisabled) {
            return;
        }

        $("#chat-container").animate({ height: "40px"}, 200);
        $("#chat-body").animate({ height: "0px"}, 200);
        $("#chat-header i.fa-chevron-down").css("display", "none");
        $("#chat-header i.fa-chevron-up").css("display", "initial");
    }
    maximizeChat() {
        if (this.chatDisabled) {
            return;
        }

        $("#chat-container").animate({ height: "540px"}, 200);
        $("#chat-body").animate({ height: "500px"}, 200);
        $("#chat-header i.fa-chevron-up").css("display", "none");
        $("#chat-header i.fa-chevron-down").css("display", "initial");
    }
    openAdvancedMenu() {
        if (!this.isAssigned || this.chatDisabled) {
            return; /* Can't send a message until volunteer assigned */
        }

        $("#chat-container > #chat-body > #chat-content").animate({ height: "340px"}, 200);

        $("#menu-container").css("display", "block");
        $("#chat-form .fa-cog").css("display", "none");
        $("#chat-form .fa-times").css("display", "initial");

        $('#chat-content').animate({ scrollTop: $('#chat-main').prop("scrollHeight") }, 1000);
    }
    closeAdvancedMenu() {
        $("#chat-container > #chat-body > #chat-content").animate({ height: "460px"}, 200);

        setTimeout(() => { 
            $("#menu-container").css("display", "none");
            $("#chat-form .fa-cog").css("display", "initial");
            $("#chat-form .fa-times").css("display", "none");
        }, 150);
    }
    sendMessage() {
        if (!this.isAssigned || this.chatDisabled) {
            /* Can't send a message until volunteer assigned */
            return;
        }

        const inputText = $('#chat-message').val();
    
        if (this.socket && inputText) {
            this.socket.emit('out chat message', inputText);
            $('#chat-message').val('');
        }
    }
    chatStarted() {
        this.isAssigned = true;

        if (settings.notificationDefault) {
            this.playIncomingMsgSound();
        }

        if (settings.autoHelloFromVol) {
            this.addMessage(`${lang.helloImVolFromTheHelpCenterYouCanStartTyping}`, "in");
        } else {
            const time = getCurrentIsraelTime();
            $('#chat-start-time').text(time);
            $("#chat-main .chat-started-text").css("display", "block");
        }
        
        /* Enable the chat message buttons and change colors */
        $("#chat-form .fa-cog").addClass("pointer button-color-enabled").removeClass("button-color-disabled");
        $("#chat-form .fa-arrow-right").addClass("pointer button-color-enabled").removeClass("button-color-disabled");
        $('#header-text').text(`${lang.vol}`);
    }
    chatEnded() {
        this.chatDisabled = true;

        $("#chat-container > #chat-ended-overlay").css("display", "initial");
    }
    addMessage(msg, type) {
        if (this.chatDisabled) {
            return;
        }

        if (this.volume && type == "in") {
            this.playIncomingMsgSound();
        }

        let writer = type == "in" ? `${lang.vol}` : `${lang.me}`;
        let timeClassName = type == "in" ? "time-in" : "time-out";
        const time = getCurrentIsraelTime();

        $('#chat-history').append($('<li class=' + timeClassName + '></li>').text(`${writer} ${time}`));
        $('#chat-history').append($('<li class=' + type + '></li>').text(msg));
        $('#chat-content').animate({ scrollTop: $('#chat-main').prop("scrollHeight") }, 1000);
    }
    sendTypingEvent() {
        if (this.chatDisabled) {
            return;
        }

        if (this.isAssigned && !this.isTyping) {
            this.isTyping = true;
            this.socket.emit('user is typing', "typing");

            setTimeout(() => this.isTyping = false, 3000);
        }
    }
    showTypingMessage() {
        if (this.chatDisabled) {
            return;
        }

        if (this.isAssigned && !this.volunteerIsTyping) {
            this.volunteerIsTyping = true;
            $("#waiting-msg").css("visibility", "visible");

            setTimeout(() => { 
                    this.volunteerIsTyping = false; 
                    $("#waiting-msg").css("visibility", "hidden");
                },
                3000,
            );
        }
    }
    toggleVolume() {
        if (this.chatDisabled) {
            return;
        }

        this.volume = !this.volume;

        if (this.volume) {
            $("#menu-volume .fa-volume-off").css("display", "inline-block");
            $("#menu-volume .fa-volume-up").css("display", "none");
            $("#menu-volume p").text(`${lang.muteNotifications}`);
        } else {
            $("#menu-volume .fa-volume-off").css("display", "none");
            $("#menu-volume .fa-volume-up").css("display", "inline-block");
            $("#menu-volume p").text(`${lang.turnOnNotifications}`);
        }
    }
    playIncomingMsgSound() {
        const mp3Source = `<source src="${process.env.DOMAIN}/audio/when.mp3" type="audio/mpeg">`;
        const oggSource = `<source src="${process.env.DOMAIN}/audio/when.ogg" type="audio/ogg">`;
        const embedSource = '<embed hidden="true" autostart="true" loop="false" src="audio/when.mp3">';
        document.getElementById("sound").innerHTML='<audio autoplay="autoplay">' + mp3Source + oggSource + embedSource + '</audio>';
    }
}

document.getElementById("open-chat-button").onclick = () => {
    const workingHours = checkIfWorkingNow();

    if (workingHours) {
        createWidgetHtml();
        createChatAndListeners();  
    } else {
        createNotAvailableMessage();
    }
};

function getCurrentIsraelTime() {
    const options = {timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit"}
    const time = new Date().toLocaleString("he-IL", options);
    return time;
}

function createChatAndListeners() {
    const socket = io(`${process.env.DOMAIN}`, {
        reconnection: false,
        pingTimeout: 300000
    });
    
    socket.on('disconnect', () => {
        chat.chatEnded();
    });

    chat = new Chat(socket); 
    chat.openChat();

    $("#chat-header .fa-times").click(() => {
        chat.closeChat();
    });
    $('#chat-header .fa-chevron-down').click(() => {
        chat.minimizeChat();
    });
    $('#chat-header .fa-chevron-up').click(() => {
        chat.maximizeChat();
    });
    $('#chat-form .fa-arrow-right').click(() => {
        chat.sendMessage();
    });
    $('#chat-form .fa-cog').click(() => {
        chat.openAdvancedMenu();
    });
    $('#chat-form .fa-times').click(() => {
        chat.closeAdvancedMenu();
    });
    $('#chat-ended-overlay #chat-ended-button').click(() => {
        chat.closeChat();
    });

    $('#menu-end-conversation').click(() => {
        chat.chatEnded();
    });
    $('#menu-send-email').click(() => {
        console.log('menu-send-email');
    });
    $('#menu-print-chat').click(() => {
        console.log('menu-print-chat');
    });
    $('#menu-volume').click(() => {
        chat.toggleVolume();
    });

    $('input#chat-message').on("input", function() {
        chat.sendTypingEvent();
    });
    $('#chat-form').submit(e => {
        chat.sendMessage();
        e.preventDefault(); 
        return false;
    });

    if (settings.autoMinimizeOnBlur) {
        $(window).blur(() => {
            chat.minimizeChat();
        });
    }

    chat.socket.on('out chat message', (msg) => {
        chat.addMessage(msg, "out");
    });
    chat.socket.on('in chat message', (msg) => {
        chat.addMessage(msg, "in");
    });
    chat.socket.on('chat started', (msg) => {
        chat.chatStarted();
    });
    chat.socket.on('chat ended', (msg) => {
        chat.chatEnded();
    });
    chat.socket.on('volunteer is typing', (msg) => {
        chat.showTypingMessage();
    });
}

function createNotAvailableMessage() {
    const messageHtml =
        `<p>${settings.notAvailableMessage || lang.chatNotActiveMessage}</p>` +
        `<button>${lang.ok}</button>`;

    const body = document.body;
    const newDiv = document.createElement("section");
    newDiv.setAttribute("id", "chat-not-available-now-container");
    newDiv.innerHTML = messageHtml;
    body.insertAdjacentElement("afterBegin", newDiv);

    $("#open-chat-button").css("display", "none");

    $("#chat-not-available-now-container button").click(() => {
        destroyNotAvailableMessage();
    });
}

function destroyNotAvailableMessage() {
    const msgContainer = document.getElementById("chat-not-available-now-container");
    msgContainer.innerHTML = "";
    msgContainer.remove();

    $("#open-chat-button").css("display", "block");
    $("#chat-not-available-now button").unbind();
}

function createWidgetHtml() {
    const chatHtml =
        '<div id="chat-container" class="none fixed">' +
            '<div id="sound"></div>' +
            '<section id="chat-ended-overlay" class="chat-overlay none full-width">' +
                '<div id="chat-ended-button">' +
                    `<p>${lang.conversationEnded}<br>
                        ${lang.clickToCloseChat}</p>` +
                '</div>' +
            '</section>' +
            '<section id="chat-header" class="full-width">' +
                '<div class="flex">' +
                    '<i class="fa fa-comment-o white"></i>' +
                    `<p id="header-text" class="rtl">${lang.connecting}</p>` +
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
                        `<p>${lang.closingChatEraseMessages}.<br>` +
                        `<br>${lang.reopenChatStartsWithNewVol}.</p><br>` +
                        `<p>${lang.oneOfOurVolsWillBeWithYouShortly}.<br></p>` +
                        '<span id="chat-start-time" class="chat-started-text time-general"></span>' +
                        `<p class="chat-started-text">${lang.helloImVolFromTheHelpCenterYouCanStartTyping}</p>` +
                        '<ul id="chat-history"></ul>' +
                    '</div>' +
                    '<div id="waiting-msg">' +
                        `<p>${lang.volIsTyping}</p>` +
                    '</div>' +
                '</section>' +
                '<section id="chat-message-container" class="full-width">' +
                    '<form action="#" id="chat-form" class="flex">' +
                        '<i class="fa fa-cog fa-lg button-color-disabled"></i>' +
                        '<i class="fa fa-times fa-lg pointer button-color-enabled none"></i>' +
                        `<input id="chat-message" class="rtl" autocomplete="off" placeholder="${lang.typeTextHere}""/>` +
                        '<i class="fa fa-arrow-right fa-lg button-color-disabled""></i>' +
                    '</form>' +
                '</section>' +
                '<section id="menu-container" class="none">' +
                    '<div id="menu-content" class="flex">' +
                        '<article id="menu-end-conversation">' +
                            '<div><i class="fa fa-ban fa-lg"></i></div>' +
                            `<p>${lang.endConversation}</p>` +
                        '</article>' +
                        '<article id="menu-volume">' +
                            '<div>' +
                                `${settings.notificationDefault ? 
                                    '<i class="fa fa-volume-off fa-lg"></i>' +
                                    '<i class="fa fa-volume-up fa-lg none"></i>' : 
                                    '<i class="fa fa-volume-off fa-lg none"></i>' +
                                    '<i class="fa fa-volume-up fa-lg"></i>'}` +
                            '</div>' +
                            `<p>` + `${settings.notificationDefault ? lang.muteNotifications : lang.turnOnNotifications}` + `</p>` +
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

function checkIfWorkingNow() {
    if (!settings.timeLimit) {
        return true;
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentHour = currentDate.getHours();
    
    return (settings.days[currentDay] && currentHour >= settings.startTime && currentHour < settings.endTime);
}
