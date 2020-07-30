$(document).ready(function() {
    const israelTimezoneStr = getIsraelTimezoneStr();
    moment.tz.add(israelTimezoneStr);

    let startDateObj = document.getElementsByName("startDate")[0];
    let endDateObj = document.getElementsByName("endDate")[0];
    startDateObj.value = moment().subtract(6, "days").format("yyyy-MM-DD");
    endDateObj.value = moment().add(1, "days").format("yyyy-MM-DD");

    $("#logs-form").submit(function(event) {
        event.preventDefault();

        let keyVal = document.getElementsByName("key")[0].value;
        if (!keyVal) {
            console.log("Please enter a valid key");
            return;
        }

        const jsonData = prepareDate();

        $('#results-table tbody tr').html('');
        $(".spinner").css("display", "block");

        $.ajax({
            type: "POST",
            url: "/api/logs/chat",
            data: jsonData,
            success: function(results){
                insertDataToTable(results);
            },
            error: function(error){
                console.log("error: " + error);
                $(".spinner").css("display", "none");
            }
        });
    });
});

function insertDataToTable(results) {
    $(".spinner").css("display", "none");

    const html1 = '<th scope="col">#</th><th scope="col">Datetime</th><th scope="col">Type</th><th scope="col">Message</th>';
    const html2 = '<th scope="col">User id</th><th scope="col">User</th><th scope="col">IP address</th>';

    $('#results-table thead tr').
        html(`${html1}${html2}`);

    if (!results || results.length == 0) {
        return;
    }

    results.forEach((item, i) => {
        const event = getEventDetails(item.eventType);

        let userIdCode = item.userId ? item.userId.substring(12, 14).toUpperCase() : "-";
        let userId = item.userId || "-";
        let ipAddress = item.ipAddress || "-";
        const timestamp = convertToTimezone(item.timestamp);

        const row1 = `<tr class=${event.eventClass}><th scope="row">${i+1}</th><td>${timestamp}</td><td>${event.eventName}</td>`;
        const row2 = `<td>${item.message}</td><td>${userId}</td><td>${userIdCode}</td><td>${ipAddress}</td></tr>`;

        $('#results-table tbody').
            append(`${row1}${row2}`);
    });
}

function prepareDate() {
    const startDateVal = document.getElementsByName("startDate")[0].value;  /* Format: yyyy-mm-dd */
    const endDateVal = document.getElementsByName("endDate")[0].value;      
    const dates = checkDates(startDateVal, endDateVal);

    let limitVal = document.getElementsByName("limit")[0].value;
    if (limitVal <= 0) {
        limitVal = 100;
    }

    let offsetVal = document.getElementsByName("offset")[0].value;
    if (limitVal < 0) {
        limitVal = 0;
    }

    const jsonData = {
        "key": document.getElementsByName("key")[0].value,
        "eventType": document.getElementsByName("eventType")[0].value,
        "startDate": dates.startDate,
        "endDate": dates.endDate,
        "limit": limitVal,
        "offset": offsetVal
    }

    return jsonData;
}

function checkDates(startDate, endDate) {
    let datesValid = false;
    let start;
    let end;

    try {
        start = moment(startDate).format("yyyy-MM-DD");
        end = moment(endDate).format("yyyy-MM-DD");

        if (moment(startDate).isBefore(endDate)) {
            datesValid = true;
        } 
    } catch(error) {
        console.log(`Error trying to parse dates ${startDate} ${endDate}: ${error}`);
    }

    if (!datesValid) {
        start = moment().subtract(6, "days").format("yyyy-MM-DD");
        end = moment().add(1, "days").format("yyyy-MM-DD");

        let startDateObj = document.getElementsByName("startDate")[0];
        let endDateObj = document.getElementsByName("endDate")[0];
        startDateObj.value = start;
        endDateObj.value = end;
    }

    return {"startDate": start, "endDate": end }
}

function getEventDetails(eventType) {
    let eventName;
    let eventClass;

    switch(eventType) {
        case 1: {
            eventName = "User connected";
            eventClass = "user-connected";
            break;
        }
        case 2: {
            eventName = "User disconnected";
            eventClass = "user-disconnected";  
            break;
        }
        case 3: {
            eventName = "Chat started";
            eventClass = "chat-started";   
            break;
        }
        case 4: {
            eventName = "Incoming message";
            eventClass = "incoming-message";
            break;
        }
        case 5: {
            eventName = "Outgoing message";
            eventClass = "outgoing-message";  
            break;
        }
        case 6: {
            eventName = "Error";
            eventClass = "error";  
            break;
        }
        case 7: {
            eventName = "Chat ended";
            eventClass = "chat-ended";  
            break;
        }
        default: {
            eventName = "general";
        }
    }

    return {"eventName": eventName, "eventClass": eventClass}
}

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
