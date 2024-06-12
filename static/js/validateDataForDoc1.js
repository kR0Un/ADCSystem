document.querySelectorAll('.input-field').forEach(function(field) {
    field.addEventListener('input', function() {
        validateField(this);
    });
});


function minFormValidate() {
    let isValid = true;
    const doc_name = document.getElementById('doc-name');
    const phone_applicant = document.getElementById('phone_applicant');
    const phone_defendant = document.getElementById('phone_defendant');
    const phone_representative = document.getElementById('phone_representative');
    const cost_lawsuit = document.getElementById('cost_lawsuit');
    const date = document.getElementById('date');

    isValid = validateField(doc_name) && isValid;
    isValid = validateField(phone_applicant) && isValid;
    isValid = validateField(phone_defendant) && isValid;
    isValid = validateField(phone_representative) && isValid;
    isValid = validateField(cost_lawsuit) && isValid;
    isValid = validateField(date) && isValid;

    return isValid;
}


function validateField(field) {
    const errorMessageId = 'error-' + field.id;
    const placeholderId = 'placeholder-' + field.id
    if (field.id === 'fio_applicant' || field.id === 'fio_defendant' || field.id === 'fio_representative') {
        if (!isValidName(field.value)) {
            document.getElementById(errorMessageId).textContent = 'Неверный формат ФИО';
            document.getElementById(errorMessageId).style.display = 'block';
            field.classList.add('input-field-warning');
            document.getElementById(placeholderId).classList.add('input-field-placeholder-warning');
            return false;
        } else {
            document.getElementById(errorMessageId).style.display = 'none';
            field.classList.remove('input-field-warning');
            document.getElementById(placeholderId).classList.remove('input-field-placeholder-warning');
            return true;
        }
    } else if (field.id === 'date') {
        if (!isValidDate(field.value)) {
            document.getElementById(errorMessageId).textContent = 'Неверный формат даты';
            document.getElementById(errorMessageId).style.display = 'block';
            field.classList.add('input-field-warning');
            document.getElementById(placeholderId).classList.add('input-field-placeholder-warning');
            return false;
        } else {
            document.getElementById(errorMessageId).style.display = 'none';
            field.classList.remove('input-field-warning');
            document.getElementById(placeholderId).classList.remove('input-field-placeholder-warning');
            return true;
        }
    } else if (field.id === 'cost_lawsuit') {
        if (field.value < 0 || field.value === '-0') {
            document.getElementById(errorMessageId).textContent = 'Цена иска не может быть меньше 0';
            document.getElementById(errorMessageId).style.display = 'block';
            field.classList.add('input-field-warning');
            document.getElementById(placeholderId).classList.add('input-field-placeholder-warning');
            return false;
        } else if (field.value.trim() === '') {
            document.getElementById(errorMessageId).textContent = 'Введите цену иска';
            document.getElementById(errorMessageId).style.display = 'block';
            field.classList.add('input-field-warning');
            document.getElementById(placeholderId).classList.add('input-field-placeholder-warning');
            return false;
        } else {
            document.getElementById(errorMessageId).style.display = 'none';
            field.classList.remove('input-field-warning');
            document.getElementById(placeholderId).classList.remove('input-field-placeholder-warning');
            return true;
        }
    } else if (field.id === 'phone_applicant' || field.id === 'phone_defendant' || field.id === 'phone_representative') {
        if (!isValidPhoneNumber(field.value)) {
            document.getElementById(errorMessageId).textContent = 'Неверный формат номера телефона';
            document.getElementById(errorMessageId).style.display = 'block';
            field.classList.add('input-field-warning');
            document.getElementById(placeholderId).classList.add('input-field-placeholder-warning');
            return false;
        } else {
            document.getElementById(errorMessageId).style.display = 'none';
            field.classList.remove('input-field-warning');
            document.getElementById(placeholderId).classList.remove('input-field-placeholder-warning');
            return true;
        }
    } else if (field.value.trim() == '') {
        document.getElementById(errorMessageId).style.display = 'block';
        field.classList.add('input-field-warning');
        document.getElementById(placeholderId).classList.add('input-field-placeholder-warning');
        return false;
    } else {
        document.getElementById(errorMessageId).style.display = 'none';
        field.classList.remove('input-field-warning');
        document.getElementById(placeholderId).classList.remove('input-field-placeholder-warning');
        return true;
    }
}

function isValidName(name) {
    var regex = /^([А-ЯЁ][а-яё]*[. ]?){1,4}[А-ЯЁ][а-яё]*[.]?$/;
    return regex.test(name);
}

function isValidPhoneNumber(phone_number) {
    var regex = /^\+?\d{1}?[-.\s]?\(?\d{3}?\)?[-.\s]?\d{3}[-.\s]?\d{2}[-.\s]?\d{2}$/;
    return regex.test(phone_number);
}

function isValidDate(date) {
    return !isNaN(Date.parse(date));
}

function validateForm() {
    var isValid = true;
    var fields = document.querySelectorAll('.input-field');
    fields.forEach(function(field) {
        if (!validateField(field)) {
            isValid = false;
            //return isValid;
        }
    });
    return isValid;
}