// ====== GESTION DES INPUTS (Mobile & PC) ======

// Variables pour les gestes (Touch)
let startX = 0;
let startY = 0; // Ajouté pour pouvoir ignorer le swipe vertical
let lastTap = 0; // Pour le double tap

const GAME_SCREEN_ID = "game-screen";
const MIN_SWIPE_DISTANCE = 80;
const DOUBLE_TAP_TIMEOUT = 300; // ms

// 1. GESTION DES ÉVÉNEMENTS TACTILES (Mobile)

document.addEventListener("touchstart", e => {
    // 🚨 Vérification 1 : Si l'utilisateur n'est pas sur l'écran de jeu, on ignore.
    if (!document.getElementById(GAME_SCREEN_ID).classList.contains("active")) return;
    
    // Si l'écran est actif, on enregistre le point de départ
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
    // 🚨 Vérification 2 : Si l'utilisateur n'est pas sur l'écran de jeu, on ignore.
    if (!document.getElementById(GAME_SCREEN_ID).classList.contains("active")) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // Logique du Double Tap
    const tapLength = new Date().getTime() - lastTap;
    
    // Condition 1: Mouvement significatif (Swipe)
    if (Math.abs(deltaX) > MIN_SWIPE_DISTANCE && Math.abs(deltaY) < 50) {
        // Balayage horizontal (gauche ou droite)
        foundWord(false); // Action "Passer" (Ignoré)
        lastTap = 0; // Réinitialise le compteur de tap après un swipe
    } 
    // Condition 2: Double Tap (Trouvé)
    else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) { // S'assurer que c'est un tap simple, pas un swipe raté
        if (tapLength < DOUBLE_TAP_TIMEOUT && tapLength > 0) {
            foundWord(true); // Action "Trouvé"
            lastTap = 0; // Double tap complété
        } else {
            lastTap = new Date().getTime(); // Mémorise le premier tap
        }
    }
    // Si c'était un swipe vertical, ou un mouvement non reconnu, on ne fait rien.
});

// 2. GESTION DU CLAVIER (PC/Tablette)

document.addEventListener("keydown", e => {
    // S'assurer que nous sommes sur l'écran de jeu
    if (!document.getElementById(GAME_SCREEN_ID).classList.contains("active")) return; 
    
    let handled = false;

    // Espace pour "Trouvé"
    if (e.code === "Space") {
        foundWord(true);
        handled = true;
    } 
    // Flèches gauche/droite pour "Passer"
    else if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
        foundWord(false);
        handled = true;
    }
    
    if (handled) {
        e.preventDefault(); // Empêche les actions par défaut du navigateur (ex: scroll)
    }
});

// ====== RACCORDEMENT DES BOUTONS D'ÉCRAN DE FIN ======
// (Mettre ceci à la fin de votre fichier app.js, dans le DOMContentLoaded)

// Vous n'avez plus besoin du if (replayBtn) car on assume qu'il est dans l'index.html
replayBtn.onclick = () => startGame(lastCategory); 
backBtn.onclick = showCategories;
