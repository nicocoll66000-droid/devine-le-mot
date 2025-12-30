document.addEventListener("DOMContentLoaded", () => {

    // 1. ENREGISTREMENT DU SERVICE WORKER (PWA)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('Service Worker enregistré : ', reg.scope))
                .catch(err => console.log('Échec de l\'enregistrement : ', err));
        });
    }

    // ====== VARIABLES GLOBALES ======
    
    // Les catégories seront chargées dans cet objet
    let categories = {}; 
    
    let gameWords = [];
    let currentIndex = 0;
    let foundCount = 0;
    let timer = 60;
    let timerInterval;
    let lastCategory = "";

    const wordDiv = document.getElementById("word");
    const categoriesContainer = document.getElementById("categories");
    const timerEl = document.getElementById("timer");
    const scoreEl = document.getElementById("score");
    const replayBtn = document.getElementById("replay");
    const backBtn = document.getElementById("back-categories");
    const loadingEl = document.getElementById("loading-status"); // Assurez-vous d'ajouter un élément loading dans votre HTML

    // 🚨 Assurez-vous que les chemins d'accès aux fichiers audio sont corrects
    const ticking = new Audio("tictac.mp3"); 
    const bomb = new Audio("bomb.mp3");
    
    // Constantes pour les gestes
    const GAME_SCREEN_ID = "game-screen";
    const MIN_SWIPE_DISTANCE = 80;
    const DOUBLE_TAP_TIMEOUT = 300; // ms

    // ====== FONCTIONS DE CHARGEMENT ET DÉMARRAGE ======

    async function loadDataAndStart() {
        if (loadingEl) loadingEl.innerText = "Chargement des mots...";
        
        try {
            // Récupère les données depuis le fichier JSON
            const response = await fetch('categories.json');
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des catégories: ' + response.statusText);
            }
            
            // Convertit la réponse en objet JavaScript
            categories = await response.json();
            
            // Une fois les données chargées, on affiche l'interface
            renderCategories(); 
            if (loadingEl) loadingEl.style.display = 'none';

        } catch (error) {
            console.error("Impossible de charger les données du jeu:", error);
            if (loadingEl) {
                 loadingEl.innerText = "Erreur: Impossible de charger la liste des mots. Vérifiez la connexion ou le fichier categories.json.";
                 loadingEl.style.color = '#D7263D';
            }
        }
    }

    // ====== FONCTIONS D'INTERFACE ET DE JEU ======
    
    function renderCategories() {
        categoriesContainer.innerHTML = "";
        Object.keys(categories).forEach(name => {
            const div = document.createElement("div");
            div.className = "category";
            div.innerText = name;
            div.onclick = () => startGame(name);
            categoriesContainer.appendChild(div);
        });
        showCategories();
    }

    function showCategories() {
        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        document.getElementById("categories-screen").classList.add("active");
    }

    function startGame(category) {
        lastCategory = category;
        // Utilisez une copie du tableau des mots pour pouvoir le modifier (shuffle)
        gameWords = shuffleArray([...categories[category]]); 
        currentIndex = 0;
        foundCount = 0;
        timer = 60;

        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        document.getElementById(GAME_SCREEN_ID).classList.add("active");

        // Gérer l'audio
        ticking.currentTime = 0; 
        ticking.loop = true;
        // Utilisation de catch pour gérer le blocage du navigateur
        ticking.play().catch(e => console.log("Audio tic-tac bloqué, lecture manuelle nécessaire.", e));

        if (timerInterval) clearInterval(timerInterval);
        timerEl.innerText = timer;
        timerInterval = setInterval(() => {
            timer--;
            timerEl.innerText = timer;
            if (timer <= 0) endGame();
        }, 1000);

        showWord();
    }

    function showWord() {
        wordDiv.innerText = gameWords[currentIndex] || "";
        wordDiv.style.color = "#00ffff"; 
    }
    
    // Fonction principale appelée par les gestes/boutons
    window.foundWord = function(correct) {
        if (!document.getElementById(GAME_SCREEN_ID).classList.contains("active") || currentIndex >= gameWords.length) return;

        if (correct) {
            document.body.classList.add("green-bg");
            ticking.pause();
            bomb.currentTime = 0;
            bomb.play().catch(e => {});
            foundCount++;
        } else {
            document.body.classList.add("red-bg");
        }

        if (navigator.vibrate) navigator.vibrate(100);

        setTimeout(() => {
            document.body.classList.remove("green-bg", "red-bg");
            
            // Relancer le tic-tac si le jeu n'est pas terminé
            if (correct && currentIndex < gameWords.length - 1) {
                 ticking.currentTime = 0;
                 ticking.play().catch(e => {});
            }
            
            nextWord();
        }, 300);
    }

    function nextWord() {
        currentIndex++;
        if (currentIndex >= gameWords.length) {
            endGame();
        } else {
            showWord();
        }
    }

    function endGame() {
        clearInterval(timerInterval);
        ticking.pause();
        bomb.currentTime = 0; 
        bomb.play().catch(e => {}); 
        
        scoreEl.innerText = "Mots trouvés : " + foundCount;
        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        document.getElementById("result-screen").classList.add("active");
    }

    // ====== GESTION DES INPUTS (Mobile & PC) ======

    // 1. GESTION DES ÉVÉNEMENTS TACTILES (Mobile)
    let startX = 0;
    let startY = 0; 
    let lastTap = 0; 

    document.addEventListener("touchstart", e => {
        // Ignorer si l'écran de jeu n'est pas actif
        if (!document.getElementById(GAME_SCREEN_ID).classList.contains("active")) return;
        
        // Enregistre le point de départ
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", e => {
        // Ignorer si l'écran de jeu n'est pas actif
        if (!document.getElementById(GAME_SCREEN_ID).classList.contains("active")) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Logique du Double Tap
        const tapLength = new Date().getTime() - lastTap;
        
        // Condition 1: Mouvement significatif (Swipe)
        // Check si le mouvement horizontal est suffisant ET que le mouvement vertical est minime
        if (Math.abs(deltaX) > MIN_SWIPE_DISTANCE && Math.abs(deltaY) < 50) {
            foundWord(false); // Action "Passer"
            lastTap = 0; 
        } 
        // Condition 2: Double Tap (Trouvé)
        // Check si le mouvement est très faible (Tap)
        else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) { 
            if (tapLength < DOUBLE_TAP_TIMEOUT && tapLength > 0) {
                foundWord(true); // Action "Trouvé"
                lastTap = 0; 
            } else {
                lastTap = new Date().getTime(); // Mémorise le premier tap
            }
        }
    });

    // 2. GESTION DU CLAVIER (PC/Tablette)
    document.addEventListener("keydown", e => {
        if (!document.getElementById(GAME_SCREEN_ID).classList.contains("active")) return; 
        
        let handled = false;

        if (e.code === "Space") {
            foundWord(true);
            handled = true;
        } 
        else if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
            foundWord(false);
            handled = true;
        }
        
        if (handled) {
            e.preventDefault(); 
        }
    });


    // ====== OUTILS ======
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ====== LANCER L'APPLICATION ======
    loadDataAndStart();

    // Raccorder les boutons Rejouer et Retour
    if (replayBtn) replayBtn.onclick = () => startGame(lastCategory);
    if (backBtn) backBtn.onclick = showCategories;
});
