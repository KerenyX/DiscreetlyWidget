class Chat {
    constructor(socket) {
        this.socket = socket;
        this.isAssigned = false;
        this.isTyping = false;
        this.volunteerIsTyping = false;
        this.volume = true;
        this.chatDisabled = false;

        const path = window.location.pathname;
        const page = path.split("/")[1];
        this.brand = page && page.startsWith("kolmila") ? "kolmila" : "";
    }

    openChat() {
        if (this.chatDisabled) {
            return;
        }

        const time = moment.tz(moment(), "Asia/Jerusalem").format("HH:mm DD/MM");
        $('#welcome-time').text(time);

        $("#chat-container").css("display", "block");
        $("#open-chat-button").css("display", "none");

        if (!this.brand) {
            $("#permission").css("display", "block");
        }
    }
    closeChat() {
        $("#chat-container").css("display", "none");
        $("#open-chat-button").css("display", "block");

        if (!this.brand) {
            $("#permission").css("display", "none");
        }

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
        $("#chat-form .fa-plus").css("display", "none");
        $("#chat-form .fa-times").css("display", "initial");

        $('#chat-content').animate({ scrollTop: $('#chat-main').prop("scrollHeight") }, 1000);
    }
    closeAdvancedMenu() {
        $("#chat-container > #chat-body > #chat-content").animate({ height: "460px"}, 200);

        setTimeout(() => { 
            $("#menu-container").css("display", "none");
            $("#chat-form .fa-plus").css("display", "initial");
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
        this.playIncomingMsgSound();

        const time = moment.tz(moment(), "Asia/Jerusalem").format("HH:mm DD/MM");
        $('#chat-start-time').text(time);

        $("#chat-main .chat-started-text").css("display", "block");

        /* Enable the chat message buttons */
        $("#chat-form .fa-plus").addClass("pointer");
        $("#chat-form .fa-arrow-right").addClass("pointer");
        $("#chat-message-container i.tooltip").
            removeClass("button-color-disabled").
            addClass("button-color-enabled").
            tooltipster('content', null);
        $("#chat-message-container #chat-message").tooltipster('content', null);
        $('#header-text').text('נציג/ה');
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

        let writer = type == "in" ? "נציג.ה" : "אני";
        let timeClassName = type == "in" ? "time-in" : "time-out";
        const time = moment.tz(moment(), "Asia/Jerusalem").format("HH:mm DD/MM");

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
            $("#menu-volume p").text("השתקת התראות");
        } else {
            $("#menu-volume .fa-volume-off").css("display", "none");
            $("#menu-volume .fa-volume-up").css("display", "inline-block");
            $("#menu-volume p").text("הפעלת התראות");
        }
    }
    playIncomingMsgSound() {
        const mp3Source = '<source src="audio/when.mp3" type="audio/mpeg">';
        const oggSource = '<source src="audio/when.ogg" type="audio/ogg">';
        const embedSource = '<embed hidden="true" autostart="true" loop="false" src="audio/when.mp3">';
        document.getElementById("sound").innerHTML='<audio autoplay="autoplay">' + mp3Source + oggSource + embedSource + '</audio>';
    }
}

$("#open-chat-button").click(() => {
    const israelTimezoneStr = getIsraelTimezoneStr();
    moment.tz.add(israelTimezoneStr);

    $('.tooltip').tooltipster({
        animation: 'grow',
        trigger: 'click',
        side: 'top',
        timer: 2000
    });

    const socket = io('https://discreetly-test.herokuapp.com');

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
    $('#chat-form .fa-plus').click(() => {
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
});

function convertToTimezone(time) {
    const convertedTimezone = moment.tz(time, "Asia/Jerusalem");
    return convertedTimezone.format("DD-MM-YYYY HH:mm:ss");
}

function getIsraelTimezoneStr() {
    return "Asia/Jerusalem|JMT IST IDT IDDT|-2k.E -20 -30 -40|01212121212132121212121212121212121212121212121212121" + 
    "2121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-26Bek.E SyMk.E 5Rb0 10r0 1px0 10N0 " + 
    "1pz0 16p0 1jB0 16p0 1jx0 3LB0 Em0 or0 1cn0 1dB0 16n0 10O0 1ja0 1tC0 14o0 1cM0 1a00 11A0 1Na0 An0 1MP0 AJ0 1Kp0 LC0 1oo0 Wl0 EQN0 Db0 " +
    "1fB0 Rb0 bXd0 gM0 8Q00 IM0 1wM0 11z0 1C10 IL0 1s10 10n0 1o10 WL0 1zd0 On0 1ld0 11z0 1o10 14n0 1o10 14n0 1nd0 12n0 1nd0 Xz0 1q10 12n0 " + 
    "1hB0 1dX0 1ep0 1aL0 1eN0 17X0 1nf0 11z0 1tB0 19W0 1e10 17b0 1ep0 1gL0 18N0 1fz0 1eN0 17b0 1gq0 1gn0 19d0 1dz0 1c10 17X0 1hB0 1gn0 " + 
    "19d0 1dz0 1c10 17X0 1kp0 1dz0 1c10 1aL0 1eN0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 " + 
    "1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0|81e4";
}
