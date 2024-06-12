function updateSpan(inputElement) {
    const spanId = `${inputElement.id}_span`;
    const span = document.getElementById(spanId);
    if (span) {
        // Заменяем все символы перевода строки на теги <br>
        const textContent = inputElement.value.replace(/\n/g, '<br>');
        span.innerHTML = textContent;

        // Делаем span видимым, если есть текст в input или textarea
        if (inputElement.value.trim() !== '') {
            span.style.display = 'inline';
        } else {
            span.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            updateSpan(input);
        });
        // Вызываем функцию updateSpan для инициализации значений
        updateSpan(input);
    });
});