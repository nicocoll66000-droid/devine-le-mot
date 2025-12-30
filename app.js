document.addEventListener("DOMContentLoaded", () => {

  // ====== CATEGORIES ET MOTS ======
  const categories = {
    "⭐ Personnalités célèbres": [
      "Emmanuel Macron","Brigitte Macron","Napoléon Bonaparte","Marie Curie","Victor Hugo",
      "Coco Chanel","Zinedine Zidane","Kylian Mbappé","David Guetta","Jean Reno",
      "Marion Cotillard","Johnny Hallyday","Omar Sy","Claude Monet","Édith Piaf",
      "François Hollande","Simone Veil","Charles de Gaulle","Gérard Depardieu","Catherine Deneuve",
      "Albert Einstein","Leonardo DiCaprio","Beyoncé","Barack Obama","Donald Trump",
      "Elon Musk","Bill Gates","Steve Jobs","Mark Zuckerberg","Oprah Winfrey"
    ],
    "⚽ Sport": [
      "Lionel Messi","Cristiano Ronaldo","Zlatan Ibrahimovic","Kylian Mbappé","Paul Pogba",
      "Rafael Nadal","Roger Federer","Serena Williams","Usain Bolt","Michael Jordan",
      "LeBron James","Virat Kohli","Novak Djokovic","Tiger Woods","Lewis Hamilton",
      "Stephen Curry","Kevin Durant","Karim Benzema","Antoine Griezmann","Sadio Mané",
      "Megan Rapinoe","Cristiano Ronaldo","Eliud Kipchoge","Neymar","Sergio Ramos",
      "Virgil van Dijk","Tom Brady","Aaron Rodgers","Simone Biles","Caeleb Dressel"
    ],
    "🎤 Musique française": [
      "Johnny Hallyday","Édith Piaf","Claude François","Serge Gainsbourg","Jean-Jacques Goldman",
      "Mylène Farmer","David Guetta","Stromae","Angèle","Jul",
      "Vianney","MC Solaar","Francis Cabrel","Louane","Patrick Bruel",
      "Indochine","Lorie","Booba","Nekfeu","Orelsan",
      "Christine and the Queens","Maître Gims","Aya Nakamura","Soprano","Amir",
      "Calogero","Coeur de Pirate","Michel Sardou","Zaz","Dalida"
    ],
    "📺 Internet": [
      "Norman","Cyprien","Squeezie","EnjoyPhoenix","Natoo",
      "Mister V","Tibo InShape","Amixem","JoueurDuGrenier","Seb la Frite",
      "McFly et Carlito","HugoDécrypte","Le Rire Jaune","Poisson Fécond","Les Inachevés",
      "Jhon Rachid","Mélanie Martinez","Vlogbrothers","Mr Beast","Logan Paul",
      "PewDiePie","Markiplier","Jacksepticeye","Shroud","Pokimane",
      "MrBeast Gaming","Dude Perfect","Rclbeauty101","Casey Neistat","James Charles"
    ],
    "🔞 Sexy +18": [
      "Levrette","Missionnaire","Menottes","Préliminaires","Fessée",
      "Strip-tease","69","Huile de massage","Nuisette","Baiser passionné",
      "Caresses","Orgasme","Dominant","Soumise","Cunnilingus",
      "Gode-ceinture","Flirt","Fétichisme","Jeux coquins","Adultère",
      "Caresse intime","Baise sauvage","Charnelle","Séduction","Plaisir partagé",
      "Érotique","BDSM","Frissons","Amour torride","Passion intense"
    ],
    "🎬 Films cultes": [
      "Le Parrain","Pulp Fiction","Inception","Titanic","Star Wars",
      "Matrix","Forrest Gump","Gladiator","Jurassic Park","Avatar",
      "Le Seigneur des Anneaux","Fight Club","Interstellar","Shining","The Dark Knight",
      "Harry Potter","La La Land","Les Affranchis","Les Dents de la Mer","Rocky",
      "Le Fabuleux Destin d'Amélie Poulain","Retour vers le futur","E.T.","Blade Runner","Le Silence des Agneaux",
      "Le Roi Lion","Les Temps Modernes","Le Bon, la Brute et le Truand","Inglourious Basterds","Le Voyage de Chihiro"
    ],
    "🍔 Nourriture": [
      "Pizza","Burger","Sushi","Raclette","Croissant",
      "Pâtes","Fromage","Chocolat","Tacos","Crêpes",
      "Quiche","Baguette","Salade","Soupe","Steak",
      "Poulet rôti","Glace","Frites","Couscous","Paella",
      "Lasagnes","Hamburger","Hot dog","Céréales","Omelette",
      "Beignet","Muffin","Café","Thé","Smoothie"
    ],
    "🎮 Jeux vidéo": [
      "Mario","Zelda","Pokémon","Sonic","Minecraft",
      "Fortnite","Call of Duty","League of Legends","Among Us","FIFA",
      "Assassin's Creed","GTA","Overwatch","Candy Crush","Tetris",
      "Pac-Man","Halo","World of Warcraft","Counter-Strike","Resident Evil",
      "The Witcher","Animal Crossing","Skyrim","Cyberpunk 2077","Valorant",
      "Minecraft Dungeons","Fall Guys","Apex Legends","Roblox","Metroid"
    ],
    "🌍 Géographie": [
      "Paris","Londres","New York","Tokyo","Sydney",
      "Rio de Janeiro","Moscou","Le Caire","Rome","Berlin",
      "Madrid","Amsterdam","Toronto","Beijing","Istanbul",
      "Athènes","Dublin","Lisbonne","Bangkok","Los Angeles",
      "Buenos Aires","Le Cap","Singapour","Helsinki","Seoul",
      "Mexico","Chicago","Delhi","Vienne","Stockholm"
    ],
    "📚 Littérature": [
      "Victor Hugo","Albert Camus","Marcel Proust","Gustave Flaubert","Émile Zola",
      "Jean de La Fontaine","Molière","Voltaire","Rabelais","Stendhal",
      "Balzac","Colette","Simone de Beauvoir","George Sand","André Gide",
      "Jules Verne","Alexandre Dumas","Honoré de Balzac","Marguerite Duras","Paul Valéry",
      "Éric-Emmanuel Schmitt","François Mauriac","Charles Baudelaire","Paul Éluard","Jean-Paul Sartre",
      "Marivaux","Romain Gary","Jean Racine","Guy de Maupassant","Antoine de Saint-Exupéry"
    ],
    "🎤 JUL": [
      "Ma tête","Wesh Alors","Tchikita","J'oublie tout","En Y",
      "On m'appelle","Loin","Mon bijou","Je trouve pas le sommeil","Ça fait mal",
      "Je tourne en rond","La zone","Ça fait plaisir","Tout seul","Pour nous",
      "La meilleure","Comme d'habitude","Rien que toi","Ça dit rien","C'est pas vrai",
      "Moula","Ça brûle","Ça va aller","C'est pas pareil","Pochon",
      "Moula 2","Tchikita remix","On est là","Plein la tête","Planète Marseille"
    ]
  };

  // ====== VARIABLES GLOBALES ======
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
  const backBtn = document.getElementById("back");

  const ticking = new Audio("tictac.mp3");
  const bomb = new Audio("bomb.mp3");

  // ====== FONCTIONS ======
  function renderCategories() {
    categoriesContainer.innerHTML = "";
    Object.keys(categories).forEach(name => {
      const div = document.createElement("div");
      div.className = "category";
      div.innerText = name;
      div.onclick = () => startGame(name);
      categoriesContainer.appendChild(div);
    });
  }

  function showCategories() {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("categories-screen").classList.add("active");
  }

  function startGame(category) {
    lastCategory = category;
    gameWords = shuffleArray([...categories[category]]);
    currentIndex = 0;
    foundCount = 0;
    timer = 60;

    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("game-screen").classList.add("active");

    ticking.loop = true;
    ticking.play();

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
  }

  // ====== GESTES ======
  let startX = 0;
  let startY = 0;
  let lastTap = 0;

  document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const tapLength = new Date().getTime() - lastTap;

    if (tapLength < 300 && tapLength > 0) {
      // DOUBLE TAP = trouvé
      foundWord(true);
      lastTap = 0;
    } else if (Math.abs(endX - startX) > 50) {
      // SWIPE = pas trouvé
      foundWord(false);
    } else {
      lastTap = new Date().getTime();
    }
  });

  function foundWord(correct) {
    if (correct) {
      document.body.classList.add("green-bg");
      ticking.pause();
      bomb.play();
    } else {
      document.body.classList.add("red-bg");
    }

    if (navigator.vibrate) navigator.vibrate(100);

    setTimeout(() => {
      document.body.classList.remove("green-bg", "red-bg");
      nextWord();
    }, 300);

    if (correct) foundCount++;
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
    bomb.play();
    scoreEl.innerText = "Mots trouvés : " + foundCount;
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("result-screen").classList.add("active");
  }

  // ====== BOUTONS ======
  if (replayBtn) replayBtn.onclick = () => startGame(lastCategory);
  if (backBtn) backBtn.onclick = showCategories;

  // ====== SHUFFLE ======
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // ====== LANCER ======
  renderCategories();
});
