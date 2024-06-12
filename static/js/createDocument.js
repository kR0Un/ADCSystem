let createBtn = document.getElementById('createDocButton');
let modalCreateBtn = document.getElementById('modalCreateDocButton');

createBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию
    if (validateForm())
        createDocument();
    else if (!minFormValidate())
        showNotification();
    else
        openModalCreateWarning();
    //добавить просто проверку на некорректные поля такие как дата номер ФИО
});

modalCreateBtn.addEventListener('click', function(event) {
    createDocument();
    createModal.style.display = "none";
});

let createModal = document.getElementById("createModalWarning");

let closeCreateModalBtn = document.getElementById("closeCreateModalWarningBtn");

function openModalCreateWarning() {
    createModal.style.display = "block";
}

closeCreateModalBtn.onclick = function() {
    createModal.style.display = "none";
}

function createDocument() {
    console.log('Создание документа...'); // Логирование вызова функции
    const formData = {
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

    console.log('Отправляем данные:', formData); // Логирование данных перед отправкой

    // Отправляем данные на сервер Flask
    fetch('/generate_doc', {
            method: 'POST',
            body: JSON.stringify(formData), // Преобразуем данные в формат JSON
            headers: {
                'Content-Type': 'application/json' // Указываем тип контента как JSON
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            console.log('Данные успешно отправлены на сервер'); // Логирование успешной отправки данных
            return response.blob();
        })
        .then(blob => {
            // Создаем URL для скачивания файла
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'document.docx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            console.log('Файл скачан'); // Логирование успешного скачивания файла
        })
        .catch(error => {
            console.error('Ошибка:', error); // Логирование ошибок
        });
}