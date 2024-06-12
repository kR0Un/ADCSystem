let updateBtn = document.getElementById('updateDocButton');
let modalUpdateBtn = document.getElementById('modalUpdateDocButton');

updateBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию
    if (validateForm()) {
        let documentId = getIdFromUrl();
        updateDocument(documentId);
    } else if (!minFormValidate())
        showNotification();
    else
        openModalUpdateWarning();
    //добавить просто проверку на некорректные поля такие как дата номер ФИО
});

modalUpdateBtn.addEventListener('click', function(event) {
    event.preventDefault();
    let documentId = getIdFromUrl();
    updateDocument(documentId);
    updateModal.style.display = "none";
});

let updateModal = document.getElementById("updateModalWarning");

let closeUpdateModalBtn = document.getElementById("closeUpdateModalWarningBtn");

function openModalUpdateWarning() {
    updateModal.style.display = "block";
}

closeUpdateModalBtn.onclick = function() {
    updateModal.style.display = "none";
}

function getIdFromUrl() {
    // Получение текущего URL
    var url = window.location.href;
    // Разделение URL по слешам и извлечение последней части
    var parts = url.split('/');
    var id = parts[parts.length - 1]; // Получение второго с конца элемента массива
    return id;
}

function updateDocument(documentId) {
    const formData = {
        document_name: document.getElementById('doc-name').value,
        judge: document.getElementById('judge').value,
        fio_applicant: document.getElementById('fio_applicant').value,
        address_applicant: document.getElementById('address_applicant').value,
        phone_applicant: document.getElementById('phone_applicant').value,
        fio_defendant: document.getElementById('fio_defendant').value,
        address_defendant: document.getElementById('address_defendant').value,
        phone_defendant: document.getElementById('phone_defendant').value,
        fio_representative: document.getElementById('fio_representative').value,
        address_representative: document.getElementById('address_representative').value,
        phone_representative: document.getElementById('phone_representative').value,
        cost_lawsuit: document.getElementById('cost_lawsuit').value,
        about_lawsuit: document.getElementById('about_lawsuit').value,
        content_lawsuit: document.getElementById('content_lawsuit').value,
        judge_request: document.getElementById('judge_request').value,
        application: document.getElementById('application').value,
        date: document.getElementById('date').value
    };

    // Отправка данных на сервер
    fetch('/document1/' + documentId + '/update', {
            method: 'POST',
            body: JSON.stringify(formData), // Преобразуем данные в формат JSON
            headers: {
                'Content-Type': 'application/json' // Указываем тип контента как JSON
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    // Если сервер вернул ошибки, выводим их на страницу
                    data.forEach(error => {
                        const errorMessageId = 'error-' + error.field;
                        const fieldId = error.field;
                        const placeholderId = 'placeholder-' + error.field;
                        // Показываем сообщение об ошибке и выделяем соответствующее поле ввода
                        showNotification2();
                        document.getElementById(errorMessageId).textContent = "Введенные данные не являются осмысленым текстом";
                        document.getElementById(errorMessageId).style.display = 'block';
                        document.getElementById(fieldId).classList.add('input-field-warning');
                        document.getElementById(placeholderId).classList.add('input-field-placeholder-warning');
                    });
                });
            } else {
                return response.json().then(data => {
                    // Если сервер вернул идентификатор документа, переходим на соответствующую страницу
                    window.location.href = '/document1/' + data.document_id;
                });
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка: ' + error.message);
        });
}