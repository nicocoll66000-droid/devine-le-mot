/********************
 * DEVINE LE MOT - V6
 ********************/

console.log("✅ app.js V6 chargé");

let categories = {
  "Animaux": [
    "Chien","Chat","Lion","Tigre","Éléphant","Girafe","Zèbre","Singe","Lapin","Cheval",
    "Dauphin","Requin","Baleine","Aigle","Faucon","Panda","Ours","Loup","Renard","Crocodile"
  ],
  "Cinéma": [
    "Titanic","Avatar","Inception","Gladiator","Matrix","Scarface","Rocky","Jaws","Alien","Amélie",
    "Taxi","Rambo","Terminator","Batman","Joker","Godfather","Interstellar","Parasite","Dune","Pulp Fiction"
  ],
  "JUL": [
    "Marseille","D'or et de platine","Bande organisée","Wesh alors","Tchikita","J'oublie tout",
    "Ça passe crème","Rien 100 rien","La zone","OVNI","Freestyle","Équipe","Rap game",
    "Classico organisé","Flow","Mic","Survêtement","Stade","Platine","Cagoule",
    "Vibes","Auto-tune","Quartiers","Hit","Streaming","Binks","Cœur","Solo","Feat","Album"
  ]
};

let words = [];
let currentWord = "";
let score = 0;
let timeLeft = 60;
let timerInterval = null;

/* ELEMENTS */
const screens = document.querySelectorAll(".screen");
const categoriesContainer = document.getElementById("categories");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const wordEl = document.getElementById("word");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");

/* UTIL */
function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function vibrate(ms = 80) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function ding() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 880;
  gain.gain.value = 0.15;
  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

/* CATEGORIES */
function loadCategories() {
  categoriesContainer.innerHTML = "";
  Object.keys(categories).forEach(cat => {
    const btn = document.createElement("div");
    btn.className = "category";
    btn.textContent = cat;
    btn.onclick = () => startGame(cat);
    categoriesContainer.appendChild(btn);
  });
}

/* GAME */
function startGame(cat) {
  words = [...categories[cat]];
  score = 0;
  timeLeft = 60;
  nextWord();
  updateTimer();
  startTimer();
  showScreen("game-screen");
}

function nextWord() {
  if (words.length === 0) endGame();
  currentWord = words.splice(Math.floor(Math.random() * words.length), 1)[0];
  wordEl.textContent = currentWord;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = timeLeft;
  timerEl.classList.toggle("warning", timeLeft <= 10);
}

function foundWord(success) {
  document.body.classList.remove("green-bg", "red-bg");
  void document.body.offsetWidth;

  if (success) {
    score++;
    document.body.classList.add("green-bg");
    wordEl.classList.add("pulse");
  } else {
    document.body.classList.add("red-bg");
    wordEl.classList.add("shake");
  }

  vibrate();
  ding();

  setTimeout(() => {
    document.body.classList.remove("green-bg", "red-bg");
    wordEl.classList.remove("pulse", "shake");
    nextWord();
  }, 400);
}

function endGame() {
  clearInterval(timerInterval);
  scoreEl.textContent = score;
  showScreen("result-screen");
}

/* GESTURES FULL SCREEN */
let touchStartX = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 50) foundWord(dx > 0);
});

let lastTap = 0;
document.addEventListener("touchend", () => {
  const now = Date.now();
  if (now - lastTap < 300) foundWord(true);
  lastTap = now;
});

/* BUTTONS */
document.getElementById("replay").onclick = () => showScreen("categories-screen");
document.getElementById("back").onclick = () => showScreen("categories-screen");

/* INIT */
wordEl.style.color = "#4fc3ff"; // bleu clair lisible
showScreen("categories-screen");
loadCategories();
