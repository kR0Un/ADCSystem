import re

# Функция для загрузки слов из файла
def load_words_from_file(filename):
    with open(filename, 'r', encoding='windows-1251') as file:
        words = set(file.read().splitlines())
    return words

# Загрузка слов из двух файлов
real_words1 = load_words_from_file('russian.txt')
real_words2 = load_words_from_file('russian_surnames.txt')
real_words3 = load_words_from_file('russian_sous.txt')

def is_word_meaningful(word):
    # Проверяем, начинается ли слово с заглавной буквы
    if word[0].isupper():
        return True

    # Проверяем, есть ли слово в одном из словарей реальных слов
    if word.lower() not in real_words1 and word.lower() not in real_words2:
        return False

    return True

def check_text_consciousness(text):
    # Разделение текста на слова
    words = [word.strip(".,?!") for word in re.split(r'\s+|[.,?!]', text) if word.strip()]

    # Проверка каждого слова на осознанность
    for word in words:
        print(word)
        if not is_word_meaningful(word):
            return False
    return True
