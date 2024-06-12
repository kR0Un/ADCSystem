var logoutBtn = document.getElementById('logout-btn');

// Добавляем обработчик события на клик
logoutBtn.addEventListener('click', function() {
    // При клике происходит перенаправление на маршрут /logout
    window.location.href = "/logout";
});