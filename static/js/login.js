document.getElementById('login-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию
    if (validateForm())
        login()
});

function login() {
    console.log('Создание документа...');

    const formData = {
        login: document.getElementById('login').value,
        password: document.getElementById('password').value,
    };

    console.log('Отправляем данные:', formData);

    fetch('/login_user', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
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