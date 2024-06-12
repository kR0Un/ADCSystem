function showNotification() {
    var notification = document.getElementById("notification");
    if (notification.style.display === "flex") {
        // Если уведомление уже отображается, то просто прерываем работу функции
        return;
    }

    notification.style.display = "flex";
    setTimeout(function() {
        notification.style.opacity = 0;
    }, 2000);
    setTimeout(function() {
        notification.style.display = "none";
        notification.style.opacity = 1;
    }, 3000);
}

function showNotification2() {
    var notification = document.getElementById("notification2");
    if (notification.style.display === "flex") {
        // Если уведомление уже отображается, то просто прерываем работу функции
        return;
    }

    notification.style.display = "flex";
    setTimeout(function() {
        notification.style.opacity = 0;
    }, 2000);
    setTimeout(function() {
        notification.style.display = "none";
        notification.style.opacity = 1;
    }, 3000);
}