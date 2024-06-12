async function startMicrophone() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new(window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = document.getElementById('oscilloscope');
    const canvasContext = canvas.getContext('2d');

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        canvasContext.fillStyle = '#F0F0F0';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            // Рисование квадратиков сверху и снизу от линии
            canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',170,255)';
            canvasContext.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth, barHeight / 2);
            canvasContext.fillRect(x, canvas.height / 2 + barHeight / 2, barWidth, -barHeight / 2);

            x += barWidth + 1;
        }
    }
    draw();
}

startMicrophone().catch(error => {
    console.error('Error accessing the microphone', error);
});