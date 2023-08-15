const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0
let time = 0
let timerstart = false;
let scoreBoard = document.getElementById("score");
scoreBoard.textContent = score;

let timeBoard = document.getElementById("time");
timeBoard.textContent = time;

fetch("./data/cards.json")
    .then( (res) => res.json())
    .then( (data) => {
        cards = [...data, ...data]
        shuffleCards();
        generateCards();
    }
)
let interval = setInterval(updateTimer, 1000);
const timerElement = document.getElementById('time');
function updateTimer() {
    time++;
    timerElement.textContent = time;
}

function startTimer(){
    if (!timerstart){
        
        interval = setInterval(updateTimer, 1000);

    }
    timerstart = true;
}
function shuffleCards(){
    let currentIndex = cards.length
    let randomIndex;
    let temporaryValue;
     
    while(currentIndex >0){
        randomIndex = Math.floor(Math.random()*currentIndex)
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue; 
    }
} 

function generateCards(){
    for(let card of cards){
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
        <div class="front">
        <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
        `;
        cardsContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard)
    }
}

function flipCard(){
    if(lockBoard){
        return;
    }

    if(this === firstCard){
        return;
    }

    this.classList.add("flipped")

    if(!firstCard){
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true
    checkForMatch()
    scoreBoard.textContent = score;
}

function checkForMatch(){
    if(firstCard.dataset.name === secondCard.dataset.name)
        disableCards();
        else{
        unflipCards();
}

function disableCards(){
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    firstCard.removeEventListener("touchstart", flipCard);
    secondCard.removeEventListener("touchstart", flipCard);
    score += 10;
    unlockBoard();
        if(score > 149){
            startConfetti()
            clearInterval(interval)
            timerstart = false;
        }
    }
}

function unflipCards(){
     setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        unlockBoard();
    }, 1000)
}

function unlockBoard(){
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart(){
    shuffleCards()
    unlockBoard()
    score = 0
    scoreBoard.textContent = score;
    time = 0;
    if(score < 149){
        clearInterval(interval)
    }
    timerstart = false;
    startTimer()
    timerElement.textContent = time;
    cardsContainer.innerHTML = "";
    generateCards()
    stopConfetti()
}