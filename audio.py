import threading
import speech_recognition as sr
import punctuationMarking

audioRecognitionStatus = "Приостановлено"
isListen = False
recognized_text = ""  # Для хранения распознанного текста

def get_audio_recognition_status():
    global audioRecognitionStatus
    return audioRecognitionStatus

def stop_listen():
    global isListen,audioRecognitionStatus
    audioRecognitionStatus = "Приостановлено"
    isListen = False

def start_listening():
    global isListen
    if not isListen:
        isListen = True
        listening_thread = threading.Thread(target=record_and_recognize_audio)
        listening_thread.start()

def record_and_recognize_audio():
    global audioRecognitionStatus, isListen, recognized_text
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()

    with microphone:
        audioRecognitionStatus = 'Подготовка...'
        recognizer.adjust_for_ambient_noise(microphone, duration=1)

    while isListen:
        with microphone:
            recognized_data = ""
            try:
                print('Listening...')
                audioRecognitionStatus = 'Говорите...'
                audio = recognizer.listen(microphone, timeout=5, phrase_time_limit=10)
            except sr.WaitTimeoutError:
                print("Проверьте, включен ли ваш микрофон")
                audioRecognitionStatus = "Проверьте, включен ли ваш микрофон"
                continue

            try:
                print("Started recognition...")
                audioRecognitionStatus = "Распознаем речь..."
                recognized_data = recognizer.recognize_google(audio, language="ru")
                print(f"Вы сказали: {recognized_data}")
                audioRecognitionStatus = f"Вы сказали: {recognized_data}"
                recognized_text = recognized_data  # Сохранение распознанного текста

                if recognized_data.lower() == "стоп":
                    audioRecognitionStatus= "Приостановлено"
                    stop_listen()
                    break

            except sr.UnknownValueError:
                print("Не удалось распознать аудио")
                audioRecognitionStatus = "Не удалось распознать аудио"
                continue
            except sr.RequestError:
                print("Connection error!")
                audioRecognitionStatus = "Connection error!"
                continue