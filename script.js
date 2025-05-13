// Глобальные переменные
let cryoCollected = 0;
let gameInterval;
let timeLeft = 10;
let progressInterval;

// Начало квеста
function startQuest() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('location1').classList.remove('hidden');
    startMusic();
}

// Проверка ответа на загадку
let currentRiddle = 1; // Текущая загадка

// Массив с правильными ответами
const riddleAnswers = {
    1: 'венти',
    2: 'аранары',
    3: 'нин гуан'
};

function checkRiddle(riddleNumber) {
    const answerInput = document.getElementById(`riddle-answer-${riddleNumber}`);
    const feedbackElement = document.getElementById(`riddle-feedback-${riddleNumber}`);
    const userAnswer = answerInput.value.toLowerCase().trim();

    if (userAnswer === riddleAnswers[riddleNumber]) {
        feedbackElement.textContent = 'Правильно!';

        // Если это последняя загадка, показываем сообщение и переходим к следующей локации
        if (riddleNumber === 3) {
            feedbackElement.textContent = 'Молодец! Сяо даёт тебе ключ к следующей локации.';
            setTimeout(() => {
                document.getElementById('location1').classList.add('hidden');
                document.getElementById('location2').classList.remove('hidden');
            }, 2000); // Переход через 2 секунды
        } else {
            // Показываем следующую загадку
            currentRiddle++;
            document.getElementById(`riddle-${currentRiddle - 1}`).classList.add('hidden');
            document.getElementById(`riddle-${currentRiddle}`).classList.remove('hidden');
        }
    } else {
        feedbackElement.textContent = 'Неверно. Попробуй ещё раз!';
    }
}

// Мини-игра: Сбор кристаллов
function startCryoGame() {
    document.getElementById('cryo-start-button').disabled = true;

    // Инициализация переменных
    cryoCollected = 0;
    timeLeft = 7;

    // Обновляем счетчик
    updateCrystalCounter();

    // Очистка игрового поля
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';

    // Запуск таймера для прогресс-бара
    updateProgressBar();
    progressInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateProgressBar();
        } else {
            endGame(false); // Завершение игры по истечении времени
        }
    }, 1000);

    // Генерация кристаллов каждую секунду
    gameInterval = setInterval(spawnCrystal, 500);
}

function spawnCrystal() {
    if (cryoCollected >= 10 || timeLeft <= 0) return; // Проверяем, завершена ли игра

    const gameArea = document.getElementById('game-area');
    const currentCrystals = gameArea.querySelectorAll('.crystal').length;

    // Если уже есть 5 кристаллов, не создаем новый
    if (currentCrystals >= 5) return;

    const crystal = document.createElement('div');
    crystal.classList.add('crystal');
    crystal.onclick = () => collectCrystal(crystal);

    // Получаем размеры контейнера #game-area
    const gameAreaRect = gameArea.getBoundingClientRect();

    // Случайная позиция для кристалла внутри контейнера
    const randomX = Math.random() * (gameAreaRect.width - 50);
    const randomY = Math.random() * (gameAreaRect.height - 50);

    crystal.style.left = `${randomX}px`;
    crystal.style.top = `${randomY}px`;

    gameArea.appendChild(crystal);
}

function collectCrystal(crystal) {
    // Проверяем, завершена ли игра
    if (cryoCollected >= 10 || timeLeft <= 0) return;

    // Добавляем анимацию сбора
    crystal.style.animation = 'collect 0.5s ease-in-out';
    crystal.style.pointerEvents = 'none'; // Отключаем взаимодействие во время анимации

    // Удаляем кристалл после завершения анимации
    setTimeout(() => {
        crystal.remove();
    }, 500);

    cryoCollected++;

    // Обновляем счетчик
    updateCrystalCounter();

    if (cryoCollected >= 10) {
        endGame(true); // Завершение игры при сборе 10 кристаллов
    }
}

function updateCrystalCounter() {
    const crystalCounter = document.getElementById('crystal-counter');
    crystalCounter.textContent = `${cryoCollected}/10`;
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${(timeLeft / 10) * 100}%`; // Обновляем ширину прогресс-бара
}

function endGame(success) {
    clearInterval(gameInterval); // Остановка генерации кристаллов
    clearInterval(progressInterval); // Остановка прогресс-бара

    // Отключаем все обработчики событий на кристаллах
    const gameArea = document.getElementById('game-area');
    const crystals = gameArea.querySelectorAll('.crystal');
    crystals.forEach((crystal) => {
        crystal.onclick = null; // Удаляем обработчик кликов
    });

    if (success) {
        document.getElementById('cryo-feedback').textContent = 'Отлично! Вы с Сяо собрали все кристаллы и путь в следующую комнату открылся."';
        setTimeout(() => {
            document.getElementById('location2').classList.add('hidden');
            document.getElementById('location3').classList.remove('hidden');
        }, 2000);
    } else {
        document.getElementById('cryo-feedback').textContent = 'К сожалению, время вышло. Попробуй еще раз!';
        document.getElementById('cryo-start-button').disabled = false;
    }
}

// Выбор пути
let combination = []; // Текущая комбинация

// Правильная комбинация (можно изменить порядок)
const correctCombination = ['pyro', 'anemo', 'geo', 'electro', 'cryo'];

// Функция для синхронизации массива combination
function updateCombination() {
    const slots = document.querySelectorAll('.slot');
    combination = Array.from(slots).map((slot) => {
        const element = slot.firstElementChild;
        return element ? element.classList[1] : null; // Берём второй класс элемента (например, 'anemo')
    });
}

// Добавляем функционал перетаскивания
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.element');
    const slots = document.querySelectorAll('.slot');

    elements.forEach((element) => {
        element.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.className);
        });
    });

    slots.forEach((slot, index) => {
        slot.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        slot.addEventListener('drop', (event) => {
            event.preventDefault();
            const data = event.dataTransfer.getData('text/plain');
            const draggedElement = document.querySelector(`.${data.split(' ')[1]}`);

            // Проверяем, есть ли уже элемент в слоте
            if (slot.firstElementChild) {
                // Если слот занят, меняем элементы местами
                const currentElement = slot.firstElementChild;
                const currentSlotIndex = Array.from(slots).indexOf(currentElement.parentElement);

                // Возвращаем текущий элемент в доступные элементы или другой слот
                if (currentSlotIndex !== -1) {
                    combination[currentSlotIndex] = null; // Очищаем предыдущее место
                }

                // Перемещаем текущий элемент в исходный слот или на новое место
                if (draggedElement.parentElement.classList.contains('slot')) {
                    draggedElement.parentElement.appendChild(currentElement); // Возвращаем старый элемент обратно
                } else {
                    document.getElementById('elements').appendChild(currentElement); // Возвращаем старый элемент в доступные элементы
                }

                // Размещаем новый элемент в слот
                slot.appendChild(draggedElement);
            } else {
                // Если слот пустой, просто добавляем элемент
                slot.appendChild(draggedElement);
            }

            // Синхронизируем массив combination
            updateCombination();

            // Проверяем, все ли слоты заполнены
            const checkButton = document.getElementById('check-button');
            if (combination.length === 5 && combination.every((el) => el)) {
                checkButton.disabled = false; // Активируем кнопку "Проверить"
            } else {
                checkButton.disabled = true; // Блокируем кнопку "Проверить"
            }
        });
    });

    // Возврат элемента в доступные элементы
    document.getElementById('elements').addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    document.getElementById('elements').addEventListener('drop', (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const draggedElement = document.querySelector(`.${data.split(' ')[1]}`);
        const sourceSlot = draggedElement.parentElement;

        // Если элемент был в слоте, очищаем его место в комбинации
        if (sourceSlot && sourceSlot.classList.contains('slot')) {
            const sourceIndex = Array.from(slots).indexOf(sourceSlot);
            combination[sourceIndex] = null; // Очищаем место в комбинации
            document.getElementById('elements').appendChild(draggedElement); // Возвращаем элемент обратно
            document.getElementById('check-button').disabled = true; // Блокируем кнопку "Проверить"
        }

        // Синхронизируем массив combination
        updateCombination();
    });
});

// Проверка комбинации
function checkCombination() {
    const feedback = document.getElementById('combination-feedback');
    let correctCount = 0;

    // Сначала синхронизируем массив combination
    updateCombination();

    // Проверяем, сколько элементов на правильных местах
    for (let i = 0; i < combination.length; i++) {
        if (combination[i] === correctCombination[i]) {
            correctCount++;
        }
    }

    if (correctCount === correctCombination.length) {
        feedback.textContent = 'Правильно! Все элементы на своих местах!';
        setTimeout(() => {
            document.getElementById('location3').classList.add('hidden');
            document.getElementById('final-location').classList.remove('hidden');
        }, 2000);
    } else {
        feedback.textContent = `Неверно. ${correctCount} элемент(а/ов) стоит(ят) на правильных местах. Попробуй ещё раз!`;
    }
}

// Открытие подарка
function openGift() {
    alert('ПОДСКАЗКА: Сюрпрпиз будет ждать тебя завтра, в 18:00 на пристани. Не пропусти;)');
}

let musicStarted = false;

function startMusic() {
    const musicPlayer = document.getElementById('background-music');
    if (musicPlayer && !musicStarted) {
        musicPlayer.play().then(() => {
            musicStarted = true; // Музыка успешно началась
            document.getElementById('start-music').style.display = 'none'; // Скрываем кнопку
        }).catch(() => {
            console.warn('Музыка не может быть воспроизведена.');
        });
    }
}

document.querySelectorAll('.element').addEventListener('touchmove', e => {
    let touch = e.targetTouches[0];
    document.querySelectorAll('.element').style.left = `${touch.pageX}px`;
    document.querySelectorAll('.element').style.top = `${touch.pageY}px`;
    e.preventDefault();
}, false);
