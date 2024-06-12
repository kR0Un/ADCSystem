function startListening() {
    fetch('/start_listening', { method: 'POST' })
        .then(response => response.json())
        .then(data => console.log(data.status));
}

function stopListening() {
    fetch('/stop_listening', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                document.activeElement.blur();
            }
        });
}

function getStatus() {
    fetch('/status')
        .then(response => response.json())
        .then(data => document.getElementById('status').innerText = data.status);
}

let lastRecognizedText = "";

function getRecognizedText() {
    fetch('/get_recognized_text')
        .then(response => response.json())
        .then(data => {
            const recognizedText = data.recognized_text;
            document.getElementById('recognized-text').innerText = recognizedText;

            if (recognizedText !== lastRecognizedText) {
                lastRecognizedText = recognizedText;
                handleRecognizedText(recognizedText);
            }
        });
}

function handleRecognizedText(recognizedText) {
    if (recognizedText.toLowerCase().includes("создай документ") || recognizedText.toLowerCase().includes("скачай документ")) {
        if (validateForm()) {
            createDocument();
        }
    }

    if (recognizedText.toLowerCase().includes("сохрани документ")) {
        if (validateForm()) {
            updateDocument();
        }
    }

    // Фокусировка на нужное поле
    if (recognizedText.toLowerCase().includes("переключись на поле наименование суда")) {
        document.getElementById('judge').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле фио истца")) {
        document.getElementById('fio_applicant').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле адрес истца")) {
        document.getElementById('address_applicant').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле номер телефона истца")) {
        document.getElementById('phone_applicant').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле фио ответчика")) {
        document.getElementById('fio_defendant').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле адрес ответчика")) {
        document.getElementById('address_defendant').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле номер телефона ответчика")) {
        document.getElementById('phone_defendant').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле фио представителя")) {
        document.getElementById('fio_representative').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле адрес представителя")) {
        document.getElementById('address_representative').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле номер телефона представителя")) {
        document.getElementById('phone_representative').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле цена иска")) {
        document.getElementById('cost_lawsuit').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле иск о")) {
        document.getElementById('about_lawsuit').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле содержание иска")) {
        document.getElementById('content_lawsuit').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле просьба к суду")) {
        document.getElementById('judge_request').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле содержание приложения")) {
        document.getElementById('application').focus();
    } else if (recognizedText.toLowerCase().includes("переключись на поле дата составления")) {
        document.getElementById('date').focus();
    }

    // Удаление текста
    if (recognizedText.toLowerCase().includes("сотри текст") || recognizedText.toLowerCase().includes("удали текст")) {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            activeElement.value = "";
            activeElement.dispatchEvent(new Event('input'));
        }
    }

    // Вставка текста
    const activeElement = document.activeElement;
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        if (!recognizedText.toLowerCase().includes("переключись на поле") &&
            !recognizedText.toLowerCase().includes("сотри текст") &&
            !recognizedText.toLowerCase().includes("удали текст") &&
            !recognizedText.toLowerCase().includes("создай документ") &&
            !recognizedText.toLowerCase().includes("стоп") &&
            !recognizedText.toLowerCase().includes("сохрани")) {
            activeElement.value += recognizedText;
            activeElement.dispatchEvent(new Event('input'));
        }
    }
}

setInterval(getStatus, 1000);
setInterval(getRecognizedText, 2000);