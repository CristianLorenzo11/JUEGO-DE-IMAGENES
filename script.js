const images = [
    'image1.jpeg', 'image2.jpeg', 'image3.jpeg', 'image4.jpeg',
    'image1.jpeg', 'image2.jpeg', 'image3.jpeg', 'image4.jpeg',
    'image5.jpeg', 'image6.jpeg', 'image7.jpeg', 'image8.jpeg',
    'image5.jpeg', 'image6.jpeg', 'image7.jpeg', 'image8.jpeg',
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0; // Contador de parejas encontradas
const totalPairs = images.length / 2; // El número total de parejas
let playerName = ''; // Variable para almacenar el nombre del jugador

// Cargar el sonido de giro de la tarjeta y la música de fondo
const flipSound = new Audio('sonido.mp3'); 
const backgroundMusic = document.getElementById('backgroundMusic'); // Asegúrate de que el elemento <audio> esté en el HTML

// Barajar las imágenes
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// Crear el tablero de juego
function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Limpia el tablero para un reinicio
    shuffle(images);
    matchesFound = 0; // Reinicia el contador de parejas

    images.forEach((imageSrc) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="${imageSrc}" alt="memory card">
                </div>
            </div>
        `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Lógica para voltear las cartas
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;  // Evitar doble clic en la misma carta

    // Reproducir sonido al voltear la carta
    flipSound.play();

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// Verificar si las cartas son iguales
function checkForMatch() {
    lockBoard = true;
    const isMatch = firstCard.querySelector('img').src === secondCard.querySelector('img').src;

    if (isMatch) {
        disableCards();
        matchesFound++; // Aumenta el contador de parejas
        if (matchesFound === totalPairs) {
            showWinModal(); // Muestra el modal cuando todas las parejas son encontradas
        }
    } else {
        unflipCards();
    }
}

// Deshabilitar las cartas emparejadas
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

// Voltear las cartas si no son iguales
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reiniciar el tablero
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Mostrar el modal de victoria
function showWinModal() {
    const winMessage = document.getElementById('winMessage');
    winMessage.textContent = `¡Felicidades ${playerName}, ganaste!`; // Personalizar el mensaje con el nombre del jugador
    const modal = document.getElementById('winModal');
    modal.style.display = 'flex'; // Muestra el modal
}

// Ocultar el modal de victoria y reiniciar el juego
function hideWinModal() {
    const modal = document.getElementById('winModal');
    modal.style.display = 'none'; // Oculta el modal
    createBoard(); // Reinicia el tablero para jugar de nuevo
}

// Lógica para el modal de bienvenida y pedir el nombre del jugador
window.onload = function() {
    const welcomeModal = document.getElementById('welcomeModal');
    welcomeModal.style.display = 'flex'; // Mostrar el modal de bienvenida
};

// Iniciar el juego después de que el jugador ingresa su nombre
document.getElementById('startGameButton').addEventListener('click', function() {
    const inputName = document.getElementById('playerName').value;
    if (inputName.trim() !== "") {
        playerName = inputName; // Almacenar el nombre del jugador
        const welcomeModal = document.getElementById('welcomeModal');
        welcomeModal.style.display = 'none'; // Cerrar el modal de bienvenida
        
        // Reproducir música de fondo
        backgroundMusic.play(); // Iniciar la música de fondo

        createBoard(); // Crear el tablero de juego
    } else {
        alert("Por favor, ingresa tu nombre para comenzar a jugar.");
    }
});

// Evento para el botón de "Jugar de nuevo"
document.getElementById('playAgain').addEventListener('click', hideWinModal);
