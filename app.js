const defaultCategories = {
    "Harry Potter": [
        "Harry Potter","Hermione Granger","Ron Weasley","Dumbledore","Voldemort",
        "Poudlard","Choixpeau","Nimbus 2000","Hagrid","Drago Malefoy"
    ],
    "Disney": [
        "Mickey","Donald","Ariel","Simba","Elsa","Buzz l'Éclair",
        "Woody","Cendrillon","Stitch","Aladdin"
    ],
    "Nourriture": [
        "Pizza","Burger","Sushi","Raclette","Croissant",
        "Pâtes","Fromage","Chocolat","Tacos","Crêpes"
    ],
    "Manga / Anime": [
        "Naruto","Luffy","Goku","Sailor Moon","Attack des Titans",
        "Death Note","One Piece","Demon Slayer","Bleach","Dragon Ball"
    ],
    "Pokémon": [
        "Pikachu","Dracaufeu","Bulbizarre","Mewtwo","Salamèche",
        "Carapuce","Évoli","Ronflex","Lucario","Magicarpe"
    ],
    "Marques connues": [
        "Nike","Adidas","Apple","Samsung","Coca-Cola",
        "McDonald's","Amazon","Google","Netflix","PlayStation"
    ],
    "Simpsons / South Park": [
        "Homer Simpson","Bart Simpson","Marge","Lisa",
        "Cartman","Stan","Kyle","Kenny","Moe","Mr Burns"
    ],
    "Game of Thrones": [
        "Jon Snow","Daenerys","Tyrion","Arya Stark","Cersei",
        "Sansa","Dragon","Trône de fer","Ned Stark","Winterfell"
    ],
    "Adultes": [
        "Levrette","Missionnaire","Menottes","Préliminaires","Fessée",
        "Strip-tease","69","Huile de massage","Nuisette","Baiser passionné"
    ]
};

function loadCategories() {
    const saved = JSON.parse(localStorage.getItem("customCategories")) || {};
    return {...defaultCategories, ...saved};
}

function renderCategories() {
    const container = document.getElementById("categories");
    container.innerHTML = "";
    const cats = loadCategories();

    Object.keys(cats).forEach(name => {
        const div = document.createElement("div");
        div.className = "category";
        div.innerText = name;
        div.onclick = () => startGame(name);
        container.appendChild(div);
    });
}

function showCategories() {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("categories-screen").classList.add("active");
}

document.getElementById("add-category").onclick = () => {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("add-screen").classList.add("active");
};

document.getElementById("save-category").onclick = () => {
    const name = document.getElementById("new-cat-name").value.trim();
    const words = document.getElementById("new-cat-words").value
        .split("\n").map(w => w.trim()).filter(w => w);

    if (name && words.length >= 10) {
        const saved = JSON.parse(localStorage.getItem("customCategories")) || {};
        saved[name] = words;
        localStorage.setItem("customCategories", JSON.stringify(saved));
        showCategories();
        renderCategories();
    } else {
        alert("Nom + minimum 10 mots");
    }
};

function startGame(category) {
    alert("Le jeu démarre pour : " + category + "\n(étape suivante)");
}

renderCategories();
let gameWords = [];
let currentIndex = 0;
let foundCount = 0;
let timerInterval;
let countdown = 60; // secondes
let ticking = new Audio("tictac.mp3");
let bomb = new Audio("bomb.mp3");

function startGame(category) {
    const cats = loadCategories();
    gameWords = shuffleArray([...cats[category]]); // copie mélangée
    currentIndex = 0;
    foundCount = 0;
    countdown = 60;

    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("game-screen").classList.add("active");

    ticking.loop = true;
    ticking.play();

    showWord();
    startTimer();
}

function showWord() {
    if (currentIndex >= gameWords.length) endGame();
    document.getElementById("word").innerText = gameWords[currentIndex];
}

// Timer 1 minute
function startTimer() {
    timerInterval = setInterval(() => {
        countdown--;
        const min = String(Math.floor(countdown / 60)).padStart(2, "0");
        const sec = String(countdown % 60).padStart(2, "0");
        document.getElementById("timer").innerText = `${min}:${sec}`;

        if (countdown <= 0) {
            clearInterval(timerInterval);
            ticking.pause();
            bomb.play();
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    ticking.pause();
    document.getElementById("score").innerText = "Mots trouvés : " + foundCount;
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("result-screen").classList.add("active");
}

// Gestes
const wordDiv = document.getElementById("word");
let lastTap = 0;

wordDiv.addEventListener("touchend", e => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) { // double tap
        foundCount++;
        nextWord();
    } else {
        lastTap = currentTime;
    }
});

wordDiv.addEventListener("swipeleft", nextWord);
wordDiv.addEventListener("swiperight", nextWord);

// Fallback simple swipe avec touch events
let startX = 0;
wordDiv.addEventListener("touchstart", e => startX = e.changedTouches[0].screenX);
wordDiv.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].screenX;
    if (Math.abs(endX - startX) > 50) nextWord();
});

function nextWord() {
    currentIndex++;
    showWord();
}

// Rejouer et retour catégories
document.getElementById("replay").onclick = () => startGame(Object.keys(loadCategories())[0]);
document.getElementById("back-categories").onclick = showCategories;

// Shuffle helper
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

