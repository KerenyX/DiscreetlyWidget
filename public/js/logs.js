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
