document.getElementById('setup-login-btn1').addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию
    if (validateForm()) {
        setup_login();
    }
});

function setup_login() {
    console.log('Регистрация пользователя...');

    const formData = {
        id: getIdFromUrl(),
        login: document.getElementById('login').value,
        password: document.getElementById('password').value,
    };

    console.log('Отправляем данные:', formData);

    fetch('/setup_login_btn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            console.log('Данные успешно отправлены на сервер');
            return response.json(); // Важное изменение: обработка JSON-ответа
        })
        .then(data => {
            if (data.redirect) {
                console.log('Перенаправление на страницу:', data.redirect);
                window.location.href = data.redirect;
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            document.getElementById('login-error').style.display = 'block';
        });
}

document.querySelectorAll('.input-field').forEach(function(field) {
    field.addEventListener('input', function() {
        validateField(this);
    });
});


function getIdFromUrl() {
    // Получение текущего URL
    var url = window.location.href;
    // Разделение URL по слешам и извлечение последней части
    var parts = url.split('/');
    var id = parts[parts.length - 1]; // Получение второго с конца элемента массива
    return id;
}

function validateField(field) {
    const errorMessageId = 'error-' + field.id;
    const placeholderId = 'placeholder-' + field.id
    if (field.value.trim() == '') {
        document.getElementById(errorMessageId).style.display = 'block';
        field.classList.add('input-field-warning');
        document.getElementById(placeholderId).classList.add('input-field-placeholder-warning');
    } else {
        document.getElementById(errorMessageId).style.display = 'none';
        field.classList.remove('input-field-warning');
        document.getElementById(placeholderId).classList.remove('input-field-placeholder-warning');
    }
}

function validateForm() {
    var isValid = true;
    var fields = document.querySelectorAll('.input-field');
    fields.forEach(function(field) {
        if (field.value.trim() === '') {
            validateField(field);
            isValid = false;
        }
    });
    return isValid;
}