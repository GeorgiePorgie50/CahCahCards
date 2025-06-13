const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

const wrongSound = document.getElementById('imthebest');
const winSoundMap = {
    "image1": "assets/fishy.mp3",
    "image2": "assets/boy.mp3",
    "image3": "assets/wang.mp3",
    "image4": "assets/goofy.mp3",
    "image5": "assets/belly.mp3"
}

document.querySelector(".score").textContent = score;

const cardsData = [
    { "image": "assets/image1.png", "name": "image1" },
    { "image": "assets/image2.png", "name": "image2" },
    { "image": "assets/image3.png", "name": "image3" },
    { "image": "assets/image4.png", "name": "image4" },
    { "image": "assets/image5.png", "name": "image5" },
    { "image": "assets/image1.png", "name": "image1" },
    { "image": "assets/image2.png", "name": "image2" },
    { "image": "assets/image3.png", "name": "image3" },
    { "image": "assets/image4.png", "name": "image4" },
    { "image": "assets/image5.png", "name": "image5" }
];

cards = [...cardsData, ...cardsData];
shuffleCards();
generateCards();

function shuffleCards() {
    let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src=${card.image}>
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        disableCards();
    } else {
        playWrongSound();
        unflipCards();
    }
}

function playWinSound() {
    const cardName = firstCard.getAttribute('data-name');
    const soundSrc = winSoundMap[cardName];

    if (soundSrc) {
        new Audio(soundSrc).play();
    }
}

function playWrongSound() {
    const sound = new Audio('assets/imthebest.mp3');
    sound.play();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    const matchedCardName = firstCard.getAttribute('data-name');
    playWinSound(matchedCardName);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}
