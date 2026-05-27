// Questions Database (13 questions: 3 rounds of 4, 1 final round)
const QUESTIONS = [
  // Round 1
  {
    id: 1,
    roundName: "Round 1: Cultural Icons",
    roundNum: 1,
    qNum: 1,
    canadian: "Terry Fox",
    facts: [
      "Diagnosed with bone cancer at age 18, leading to the amputation of his right leg.",
      "In 1980, he began the 'Marathon of Hope' to raise money and awareness for cancer research.",
      "Ran close to a marathon a day (approx. 42 km) for 143 days, totaling 5,373 kilometres.",
      "He remains the youngest person ever named a Companion of the Order of Canada."
    ],
    notes: "Terry Fox ran starting in St. John's, NL, and had to stop in Thunder Bay, ON, when the cancer spread to his lungs. The annual Terry Fox Run is now the world's largest one-day fundraiser for cancer research."
  },
  {
    id: 2,
    roundName: "Round 1: Cultural Icons",
    roundNum: 1,
    qNum: 2,
    canadian: "Alexander Graham Bell",
    facts: [
      "Born in Scotland, he immigrated to Ontario in 1870 and spent decades working in Canada.",
      "Much of his life was dedicated to inventing communication aids and teaching deaf students.",
      "In 1876, he secured the first United States patent for the telephone.",
      "He co-founded the National Geographic Society and pioneered early hydrofoils and aviation."
    ],
    notes: "Bell did much of his core work at his family home in Brantford, ON (the Homestead) and later in Baddeck, NS, where he built the Silver Dart airplane and the HD-4 hydrofoil boat."
  },
  {
    id: 3,
    roundName: "Round 1: Cultural Icons",
    roundNum: 1,
    qNum: 3,
    canadian: "Céline Dion",
    facts: [
      "She grew up as the youngest of 14 children in a musical family in Charlemagne, Quebec.",
      "She won the 1988 Eurovision Song Contest in Dublin, representing Switzerland.",
      "She recorded the award-winning theme song for Disney's 1991 animated film 'Beauty and the Beast'.",
      "Her Las Vegas show 'A New Day...' is the highest-grossing concert residency of all time."
    ],
    notes: "With over 200 million records sold worldwide, Céline is one of the most successful pop vocalists in history. She sings fluently in both French and English."
  },
  {
    id: 4,
    roundName: "Round 1: Cultural Icons",
    roundNum: 1,
    qNum: 4,
    canadian: "Keanu Reeves",
    facts: [
      "Born in Beirut, Lebanon, he grew up in Toronto and was an MVP goalie in high school hockey.",
      "He played bass guitar for the alternative rock band Dogstar during the 1990s.",
      "He is celebrated for his extreme generosity, often donating millions to crew members and cancer charities.",
      "He played the iconic characters 'Neo' in a sci-fi trilogy and a legendary dog-loving assassin."
    ],
    notes: "Keanu Reeves was nicknamed 'The Wall' in hockey. He has starred in massive franchises like The Matrix, John Wick, Bill & Ted, and Speed."
  },

  // Round 2
  {
    id: 5,
    roundName: "Round 2: Pioneers & Trailblazers",
    roundNum: 2,
    qNum: 1,
    canadian: "Chris Hadfield",
    facts: [
      "He was the first Canadian astronaut to perform a spacewalk (extravehicular activity).",
      "In 2013, he served as the Commander of the International Space Station.",
      "Gained viral fame by recording a cover of David Bowie's 'Space Oddity' while in orbit.",
      "He was a fighter pilot in the Royal Canadian Air Force, intercepting Soviet bombers."
    ],
    notes: "Hadfield spent 166 days in space. His rendition of 'Space Oddity' has over 50 million views on YouTube and was praised by David Bowie himself."
  },
  {
    id: 6,
    roundName: "Round 2: Pioneers & Trailblazers",
    roundNum: 2,
    qNum: 2,
    canadian: "Margaret Atwood",
    facts: [
      "Spent her childhood in the Canadian northern bush as her father was a forest entomologist.",
      "She is a twice-winner of the Booker Prize, first in 2000 and again in 2019.",
      "She invented the 'LongPen', a robotic device allowing authors to sign books from anywhere.",
      "She wrote the famous 1985 dystopian novel set in the oppressive Republic of Gilead."
    ],
    notes: "Atwood is a prolific poet, novelist, and environmental activist. Her work 'The Handmaid's Tale' has been adapted into an award-winning television series."
  },
  {
    id: 7,
    roundName: "Round 2: Pioneers & Trailblazers",
    roundNum: 2,
    qNum: 3,
    canadian: "Wayne Gretzky",
    facts: [
      "Nicknamed 'The Great One', he played 20 seasons in the National Hockey League.",
      "He holds the NHL record for most career goals, most assists, and most total points.",
      "Upon his retirement in 1999, his jersey number 99 was retired league-wide.",
      "He is the only player to score over 200 points in a single season, doing so four times."
    ],
    notes: "Gretzky won four Stanley Cups with the Edmonton Oilers. When he retired, he held 61 NHL records, many of which are considered unbreakable."
  },
  {
    id: 8,
    roundName: "Round 2: Pioneers & Trailblazers",
    roundNum: 2,
    qNum: 4,
    canadian: "Frederick Banting",
    facts: [
      "He was a WWI military doctor awarded the Military Cross for treating wounded under fire.",
      "At age 32, he became the youngest person to receive the Nobel Prize in Medicine.",
      "He sold the patent rights for his life-saving discovery to the University of Toronto for $1.",
      "Co-discovered the pancreatic hormone secretion used to treat diabetes: insulin."
    ],
    notes: "Banting discovered insulin alongside Charles Best in 1921. He shared his Nobel Prize money with Best, protesting that Best was not officially named in the award."
  },

  // Round 3
  {
    id: 9,
    roundName: "Round 3: Modern Legends",
    roundNum: 3,
    qNum: 1,
    canadian: "Lucy Maud Montgomery",
    facts: [
      "Raised by her grandparents in Cavendish, Prince Edward Island, which inspired her writing.",
      "Her debut novel was rejected by all publishers, so she stored it in a hatbox for years.",
      "She wrote 20 novels, 530 short stories, and over 500 poems in her lifetime.",
      "Best known as the creator of the spirited, red-haired orphan Anne Shirley."
    ],
    notes: "L.M. Montgomery published 'Anne of Green Gables' in 1908. It became an instant bestseller, making PEI a major tourist destination to this day."
  },
  {
    id: 10,
    roundName: "Round 3: Modern Legends",
    roundNum: 3,
    qNum: 2,
    canadian: "Jim Carrey",
    facts: [
      "Born in Newmarket, Ontario, his family lived in a Volkswagen van during financial hardship.",
      "He secured his big break as a cast member on the comedy sketch show 'In Living Color'.",
      "The first actor to star in three $100M+ blockbusters in a single calendar year (1994).",
      "Famous for rubber-faced physical comedy in 'Ace Ventura', 'The Mask', and 'Dumb and Dumber'."
    ],
    notes: "Jim Carrey went on to display impressive dramatic range in films like 'The Truman Show' and 'Eternal Sunshine of the Spotless Mind'."
  },
  {
    id: 11,
    roundName: "Round 3: Modern Legends",
    roundNum: 3,
    qNum: 3,
    canadian: "Tommy Douglas",
    facts: [
      "He was an accomplished amateur boxer, winning the Lightweight Championship of Saskatchewan.",
      "Led the first democratic socialist government in North America as Premier of Saskatchewan.",
      "Voted 'The Greatest Canadian' in a nationwide CBC television poll in 2004.",
      "Known as the father of Canada's universal, single-payer health care system (Medicare)."
    ],
    notes: "Douglas was premier from 1944 to 1961. He is also the grandfather of actor Kiefer Sutherland."
  },
  {
    id: 12,
    roundName: "Round 3: Modern Legends",
    roundNum: 3,
    qNum: 4,
    canadian: "Ryan Reynolds",
    facts: [
      "Raised in Vancouver, BC, he failed his high school drama class but kept acting.",
      "He became co-owner of the historic Welsh professional association football club Wrexham AFC.",
      "Owned a substantial stake in Mint Mobile, which sold to T-Mobile in a multi-billion dollar deal.",
      "He portrays the quick-witted, fourth-wall-breaking Marvel superhero Deadpool."
    ],
    notes: "Ryan Reynolds is a major Hollywood star and creative marketer, managing his production company Maximum Effort alongside various business ventures."
  },

  // Final Round
  {
    id: 13,
    roundName: "Final Round: The Showstopper",
    roundNum: 4,
    qNum: 1,
    canadian: "Sandra Oh",
    facts: [
      "Born in Nepean, Ontario, she rejected a journalism scholarship to study acting.",
      "Won a Golden Globe for playing brilliant cardiothoracic surgeon Dr. Cristina Yang on TV.",
      "She was the first person of Asian descent to host the Golden Globe Awards.",
      "She voiced the mother, Ming Lee, in the Toronto-set Pixar animated movie 'Turning Red'."
    ],
    notes: "Sandra Oh received critical acclaim for Grey's Anatomy and Killing Eve. She is one of the most prominent Canadian dramatic actresses of her generation."
  }
];

// Global Game State
const DEFAULT_STATE = {
  view: 'splash',
  currentQuestionIndex: 0,
  revealedFacts: 1,
  timeLeft: 40,
  timerRunning: false,
  answerRevealed: false,
  autoReveal: true,
  muted: false
};

let gameState = { ...DEFAULT_STATE };
let timerInterval = null;
let wikipediaImages = {}; // Cache of wiki image URLs

// Detect if running on the standalone admin page
const isAdminPage = !!document.getElementById('view-admin') && !document.getElementById('view-splash');

// Global state updater (previously missing)
function updateState(newState) {
  gameState = { ...gameState, ...newState };
  saveState();
  broadcastState();
  render();
}

// Reset game entirely
function resetGame() {
  stopTimerInterval();
  gameState = { ...DEFAULT_STATE };
  gameState.view = document.getElementById('view-container').dataset.currentView || 'splash';
  saveState();
  broadcastState();
  render();
}

function saveState() {
  localStorage.setItem('name_that_canadian_state', JSON.stringify(gameState));
}

function loadState() {
  const saved = localStorage.getItem('name_that_canadian_state');
  if (saved) {
    try {
      gameState = JSON.parse(saved);
      // Ensure local mute matches state
      if (window.gameAudio) {
        window.gameAudio.setMuted(gameState.muted);
      }
    } catch (e) {
      console.error("Error loading saved state", e);
    }
  }
}

function broadcastState() {
  if (window.gameSync && (gameState.view === 'admin' || gameState.view === 'solo' || isAdminPage)) {
    window.gameSync.broadcastState(gameState);
  }
}

// Timer Controls
function stopTimerInterval() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (window.gameAudio) {
    window.gameAudio.stopSuspense();
  }
}

function startTimer() {
  if (gameState.timerRunning) return;
  
  if (window.gameAudio) {
    window.gameAudio.init();
    window.gameAudio.startSuspense();
  }
  
  gameState.timerRunning = true;
  saveState();
  broadcastState();
  render();

  timerInterval = setInterval(() => {
    let nextTime = gameState.timeLeft - 1;
    let nextRevealed = gameState.revealedFacts;

    if (nextTime < 0) {
      nextTime = 0;
      stopTimerInterval();
      gameState.timerRunning = false;
      gameState.timeLeft = 0;
      
      if (window.gameAudio) {
        window.gameAudio.playIncorrect();
      }
      if (gameState.view === 'admin') {
        window.gameSync.triggerSound('incorrect');
      }
      
      saveState();
      broadcastState();
      render();
      return;
    }

    // Play ticking sounds
    if (nextTime <= 5 && nextTime > 0) {
      if (window.gameAudio) window.gameAudio.playWarning();
      if (gameState.view === 'admin') window.gameSync.triggerSound('warning');
    } else if (nextTime > 0) {
      if (window.gameAudio) window.gameAudio.playTick();
      if (gameState.view === 'admin') window.gameSync.triggerSound('tick');
    }

    // Auto-reveal logic at thresholds
    if (gameState.autoReveal) {
      if (nextTime <= 30 && nextTime > 20 && nextRevealed < 2) {
        nextRevealed = 2;
        triggerLocalAndRemoteSound('reveal');
      } else if (nextTime <= 20 && nextTime > 10 && nextRevealed < 3) {
        nextRevealed = 3;
        triggerLocalAndRemoteSound('reveal');
      } else if (nextTime <= 10 && nextTime > 0 && nextRevealed < 4) {
        nextRevealed = 4;
        triggerLocalAndRemoteSound('reveal');
      }
    }

    gameState.timeLeft = nextTime;
    gameState.revealedFacts = nextRevealed;
    saveState();
    broadcastState();
    render();
  }, 1000);
}

function pauseTimer() {
  if (!gameState.timerRunning) return;
  stopTimerInterval();
  gameState.timerRunning = false;
  saveState();
  broadcastState();
  render();
}

function triggerLocalAndRemoteSound(soundName) {
  if (window.gameAudio) {
    if (soundName === 'reveal') window.gameAudio.playReveal();
    if (soundName === 'correct') window.gameAudio.playCorrect();
    if (soundName === 'incorrect') window.gameAudio.playIncorrect();
    if (soundName === 'fanfare') window.gameAudio.playFanfare();
  }
  if (gameState.view === 'admin') {
    window.gameSync.triggerSound(soundName);
  }
}

// Navigation & Actions
function selectQuestion(idx) {
  if (idx < 0 || idx >= QUESTIONS.length) return;
  stopTimerInterval();
  gameState.currentQuestionIndex = idx;
  gameState.timeLeft = 40;
  gameState.revealedFacts = 1;
  gameState.timerRunning = false;
  gameState.answerRevealed = false;
  
  saveState();
  broadcastState();
  render();
  
  // Pre-fetch Wikipedia image for the new question
  prefetchWikipediaImage(QUESTIONS[idx].canadian);
}

function revealNextFact() {
  if (gameState.revealedFacts < 4) {
    gameState.revealedFacts += 1;
    triggerLocalAndRemoteSound('reveal');
    saveState();
    broadcastState();
    render();
  }
}

function revealAnswer() {
  stopTimerInterval();
  gameState.timerRunning = false;
  gameState.answerRevealed = true;
  
  triggerLocalAndRemoteSound('correct');
  
  saveState();
  broadcastState();
  render();
}

function adjustTime(amount) {
  let newTime = gameState.timeLeft + amount;
  if (newTime < 0) newTime = 0;
  if (newTime > 99) newTime = 99; // Cap at 99
  
  gameState.timeLeft = newTime;
  saveState();
  broadcastState();
  render();
}

// Wiki Image Fetcher with Caching
function prefetchWikipediaImage(canadianName) {
  if (wikipediaImages[canadianName]) return;
  
  const queryName = encodeURIComponent(canadianName);
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${queryName}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data && data.query && data.query.pages) {
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId !== "-1" && pages[pageId].thumbnail) {
          wikipediaImages[canadianName] = pages[pageId].thumbnail.source;
          // If the answer is currently revealed and we are displaying this question, re-render to show it
          if (gameState.answerRevealed && QUESTIONS[gameState.currentQuestionIndex].canadian === canadianName) {
            render();
          }
        }
      }
    })
    .catch(err => console.warn("Failed to fetch image for " + canadianName, err));
}

// DOM Rendering
function render() {
  const container = document.getElementById('view-container');
  if (!container) return;

  if (isAdminPage) {
    container.dataset.currentView = 'admin';
    const adminEl = document.getElementById('view-admin');
    if (adminEl) adminEl.classList.remove('hidden');
    renderAdminScreen('admin');
  } else {
    // If state view is 'admin' but we are on index.html, force it to 'splash'
    if (gameState.view === 'admin') {
      gameState.view = 'splash';
    }
    
    container.dataset.currentView = gameState.view;
    
    // Clean active views safely
    const splashEl = document.getElementById('view-splash');
    const presenterEl = document.getElementById('view-presenter');
    const soloEl = document.getElementById('view-solo');
    
    if (splashEl) splashEl.classList.add('hidden');
    if (presenterEl) presenterEl.classList.add('hidden');
    if (soloEl) soloEl.classList.add('hidden');

    if (gameState.view === 'splash' && splashEl) {
      splashEl.classList.remove('hidden');
    } else if (gameState.view === 'presenter' && presenterEl) {
      presenterEl.classList.remove('hidden');
      renderPresenterScreen('presenter');
    } else if (gameState.view === 'solo' && soloEl) {
      soloEl.classList.remove('hidden');
      renderPresenterScreen('solo-presenter');
      renderAdminScreen('solo-admin');
    }
  }
}

// Render the Presenter Screen UI components
function renderPresenterScreen(targetPrefix) {
  const question = QUESTIONS[gameState.currentQuestionIndex];
  
  // Update Round & Question Headers
  document.getElementById(`${targetPrefix}-round-name`).textContent = question.roundName;
  document.getElementById(`${targetPrefix}-q-num`).textContent = `Question ${question.qNum} of 4`;
  if (question.roundNum === 4) {
    document.getElementById(`${targetPrefix}-q-num`).textContent = `Final Showstopper`;
  }

  // Timer Circle SVG dasharray updates
  const timeLeft = gameState.timeLeft;
  const timePercent = timeLeft / 40;
  const timerValElement = document.getElementById(`${targetPrefix}-timer-value`);
  timerValElement.textContent = timeLeft;
  
  const ring = document.getElementById(`${targetPrefix}-timer-ring`);
  if (ring) {
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference - (timePercent * circumference);
    ring.style.strokeDashoffset = offset;
    
    // Class shifts based on remaining time
    const timerCircle = document.getElementById(`${targetPrefix}-timer`);
    timerCircle.className = "timer-circle";
    if (timeLeft <= 5) {
      timerCircle.classList.add('low-time-critical');
    } else if (timeLeft <= 15) {
      timerCircle.classList.add('low-time');
    }
  }

  // Facts Cards
  const factsContainer = document.getElementById(`${targetPrefix}-facts-container`);
  factsContainer.innerHTML = '';
  
  question.facts.forEach((factText, index) => {
    const factNum = index + 1;
    const isRevealed = gameState.revealedFacts >= factNum;
    
    const card = document.createElement('div');
    card.className = `fact-card ${isRevealed ? 'revealed' : 'locked'}`;
    
    if (isRevealed) {
      card.innerHTML = `
        <div class="fact-badge">${factNum}</div>
        <div class="fact-text">${factText}</div>
      `;
    } else {
      card.innerHTML = `
        <div class="fact-badge locked"><span class="lock-icon">🔒</span></div>
        <div class="fact-text locked-text">Fact Locked</div>
      `;
    }
    factsContainer.appendChild(card);
  });

  // Answer Overlay / Reveal Area
  const revealOverlay = document.getElementById(`${targetPrefix}-reveal-overlay`);
  if (gameState.answerRevealed) {
    revealOverlay.classList.remove('hidden');
    revealOverlay.classList.add('visible');
    
    document.getElementById(`${targetPrefix}-answer-name`).textContent = question.canadian;
    document.getElementById(`${targetPrefix}-answer-notes`).textContent = question.notes;
    
    const imgEl = document.getElementById(`${targetPrefix}-answer-image`);
    const imgUrl = wikipediaImages[question.canadian];
    if (imgUrl) {
      imgEl.src = imgUrl;
      imgEl.classList.remove('hidden');
      document.getElementById(`${targetPrefix}-avatar-fallback`).classList.add('hidden');
    } else {
      imgEl.classList.add('hidden');
      const fallback = document.getElementById(`${targetPrefix}-avatar-fallback`);
      fallback.classList.remove('hidden');
      
      // Get initials
      const initials = question.canadian.split(' ').map(n => n[0]).join('');
      fallback.textContent = initials;
    }
  } else {
    revealOverlay.classList.add('hidden');
    revealOverlay.classList.remove('visible');
  }
}

// Render the Admin Panel UI components
function renderAdminScreen(targetPrefix) {
  const question = QUESTIONS[gameState.currentQuestionIndex];
  
  // Timer buttons status
  const playBtn = document.getElementById(`${targetPrefix}-play-btn`);
  if (playBtn) {
    if (gameState.timerRunning) {
      playBtn.innerHTML = `⏸️ Pause`;
      playBtn.className = "btn btn-warning btn-glow";
    } else {
      playBtn.innerHTML = `▶️ Start`;
      playBtn.className = "btn btn-success btn-glow";
    }
  }

  // Revealed facts progress on Admin panel
  const factProgress = document.getElementById(`${targetPrefix}-fact-progress`);
  if (factProgress) {
    factProgress.textContent = `Facts: ${gameState.revealedFacts}/4`;
  }
  
  // Sync Next Fact button status
  const nextFactBtn = document.getElementById(`${targetPrefix}-next-fact-btn`);
  if (nextFactBtn) {
    nextFactBtn.disabled = gameState.revealedFacts >= 4;
  }

  // Answer reveal status
  const answerBtn = document.getElementById(`${targetPrefix}-reveal-answer-btn`);
  if (answerBtn) {
    if (gameState.answerRevealed) {
      answerBtn.textContent = "Answer Revealed";
      answerBtn.className = "btn btn-disabled";
      answerBtn.disabled = true;
    } else {
      answerBtn.textContent = "🔓 Reveal Answer";
      answerBtn.className = "btn btn-primary btn-glow";
      answerBtn.disabled = false;
    }
  }

  // Admin Cheat Sheet updates
  document.getElementById(`${targetPrefix}-cheat-title`).textContent = `Q${question.id}: ${question.canadian}`;
  document.getElementById(`${targetPrefix}-cheat-round`).textContent = question.roundName;
  document.getElementById(`${targetPrefix}-cheat-notes`).textContent = question.notes;
  
  const cheatFactsList = document.getElementById(`${targetPrefix}-cheat-facts`);
  cheatFactsList.innerHTML = '';
  question.facts.forEach((fact, i) => {
    const li = document.createElement('li');
    li.className = gameState.revealedFacts > i ? "revealed" : "locked";
    li.innerHTML = `<strong>Fact ${i+1}:</strong> ${fact}`;
    cheatFactsList.appendChild(li);
  });

  // Time tracker
  const timeTracker = document.getElementById(`${targetPrefix}-time-tracker`);
  if (timeTracker) {
    timeTracker.textContent = `Time Left: ${gameState.timeLeft}s`;
    timeTracker.className = gameState.timeLeft <= 5 ? "low" : "";
  }

  // Questions sidebar/list rendering
  const qList = document.getElementById(`${targetPrefix}-q-list`);
  if (qList) {
    qList.innerHTML = '';
    QUESTIONS.forEach((q, idx) => {
      const activeState = (gameState.currentQuestionIndex === idx) ? 'active' : '';
      const card = document.createElement('div');
      card.className = `admin-q-item ${activeState}`;
      card.onclick = () => selectQuestion(idx);
      
      card.innerHTML = `
        <div class="q-num-badge">Q${q.id}</div>
        <div class="q-info">
          <div class="q-name">${q.canadian}</div>
          <div class="q-round">${q.roundNum === 4 ? 'Final' : 'Round ' + q.roundNum}</div>
        </div>
      `;
      qList.appendChild(card);
    });
  }

  // Local sound controls
  const muteBtn = document.getElementById(`${targetPrefix}-mute-btn`);
  if (muteBtn) {
    if (gameState.muted) {
      muteBtn.innerHTML = "🔇 Unmute Controller";
      muteBtn.className = "btn btn-outline btn-active-red";
    } else {
      muteBtn.innerHTML = "🔊 Mute Controller";
      muteBtn.className = "btn btn-outline";
    }
  }

  // Presenter Sync Status indicator
  const syncStatus = document.getElementById(`${targetPrefix}-sync-status`);
  if (syncStatus && window.gameSync) {
    if (window.gameSync.isPresenterConnected) {
      syncStatus.className = "sync-indicator connected";
      syncStatus.innerHTML = "<span class='pulse-dot'></span> Sync Active";
    } else {
      syncStatus.className = "sync-indicator disconnected";
      syncStatus.innerHTML = "Sync Offline (Open Presenter Tab)";
    }
  }

  // Auto-advance toggle status
  const autoToggle = document.getElementById(`${targetPrefix}-auto-advance-toggle`);
  if (autoToggle) {
    autoToggle.checked = gameState.autoReveal;
  }
}

// Global Event Listeners & Bootstrapping
window.addEventListener('DOMContentLoaded', () => {
  loadState();

  if (isAdminPage) {
    // Standalone Admin Page Listeners
    
    // Back to Menu redirects to main index page
    document.querySelectorAll('.btn-back-menu').forEach(btn => {
      btn.onclick = () => {
        stopTimerInterval();
        window.location.href = 'index.html';
      };
    });

    // Reset buttons
    document.querySelectorAll('.btn-reset-game').forEach(btn => {
      btn.onclick = () => {
        if (confirm("Are you sure you want to reset the entire game?")) {
          resetGame();
        }
      };
    });

    // Sync status & host requests
    if (window.gameSync) {
      window.gameSync.onRequestStateReceived(() => {
        window.gameSync.broadcastState(gameState);
      });

      window.gameSync.onPresenterStatusChange((isConnected) => {
        render();
      });
    }

    // Setup Admin Panel actions
    setupAdminActionListeners('admin');

    // Ping for presenter periodically from Admin
    setInterval(() => {
      if (window.gameSync) {
        window.gameSync.pingPresenter();
      }
    }, 3000);

  } else {
    // Main index.html page listeners
    
    // Splash button controls
    const btnPresenter = document.getElementById('btn-view-presenter');
    if (btnPresenter) {
      btnPresenter.onclick = () => {
        updateState({ view: 'presenter' });
        if (window.gameSync) window.gameSync.requestState();
      };
    }

    const btnAdmin = document.getElementById('btn-view-admin');
    if (btnAdmin) {
      btnAdmin.onclick = () => {
        window.location.href = 'admin.html';
      };
    }

    const btnSolo = document.getElementById('btn-view-solo');
    if (btnSolo) {
      btnSolo.onclick = () => {
        updateState({ view: 'solo' });
      };
    }

    // Back to Menu buttons
    document.querySelectorAll('.btn-back-menu').forEach(btn => {
      btn.onclick = () => {
        stopTimerInterval();
        updateState({ view: 'splash' });
      };
    });

    // Reset buttons
    document.querySelectorAll('.btn-reset-game').forEach(btn => {
      btn.onclick = () => {
        if (confirm("Are you sure you want to reset the entire game?")) {
          resetGame();
        }
      };
    });

    // Sync state events for Presenter projection
    if (window.gameSync) {
      window.gameSync.onStateReceived((remoteState) => {
        if (gameState.view === 'presenter') {
          gameState = { ...remoteState, view: 'presenter' };
          render();
        }
      });

      window.gameSync.onSoundReceived((soundName) => {
        if (gameState.view === 'presenter' && window.gameAudio) {
          if (soundName === 'tick') window.gameAudio.playTick();
          if (soundName === 'warning') window.gameAudio.playWarning();
          if (soundName === 'reveal') window.gameAudio.playReveal();
          if (soundName === 'correct') window.gameAudio.playCorrect();
          if (soundName === 'incorrect') window.gameAudio.playIncorrect();
          if (soundName === 'fanfare') window.gameAudio.playFanfare();
        }
      });
    }

    // Setup Solo Mode admin controllers
    setupAdminActionListeners('solo-admin');
  }

  // Common setups (image prefetching, fullscreen, initial render)
  prefetchWikipediaImage(QUESTIONS[0].canadian);

  document.querySelectorAll('.btn-fullscreen').forEach(btn => {
    btn.onclick = () => {
      const element = document.documentElement;
      if (!document.fullscreenElement) {
        element.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    };
  });

  render();
});

// Setup actions for a particular admin panel instance safely
function setupAdminActionListeners(prefix) {
  const playBtn = document.getElementById(`${prefix}-play-btn`);
  if (playBtn) {
    playBtn.onclick = () => {
      if (gameState.timerRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    };
  }

  const resetQBtn = document.getElementById(`${prefix}-reset-q-btn`);
  if (resetQBtn) {
    resetQBtn.onclick = () => {
      stopTimerInterval();
      gameState.timeLeft = 40;
      gameState.revealedFacts = 1;
      gameState.timerRunning = false;
      gameState.answerRevealed = false;
      saveState();
      broadcastState();
      render();
    };
  }

  const timePlus = document.getElementById(`${prefix}-time-plus`);
  if (timePlus) timePlus.onclick = () => adjustTime(5);

  const timeMinus = document.getElementById(`${prefix}-time-minus`);
  if (timeMinus) timeMinus.onclick = () => adjustTime(-5);

  const nextFactBtn = document.getElementById(`${prefix}-next-fact-btn`);
  if (nextFactBtn) nextFactBtn.onclick = () => revealNextFact();

  const revealAnswerBtn = document.getElementById(`${prefix}-reveal-answer-btn`);
  if (revealAnswerBtn) revealAnswerBtn.onclick = () => revealAnswer();

  const prevQBtn = document.getElementById(`${prefix}-prev-q-btn`);
  if (prevQBtn) {
    prevQBtn.onclick = () => {
      selectQuestion(Math.max(0, gameState.currentQuestionIndex - 1));
    };
  }

  const nextQBtn = document.getElementById(`${prefix}-next-q-btn`);
  if (nextQBtn) {
    nextQBtn.onclick = () => {
      selectQuestion(Math.min(QUESTIONS.length - 1, gameState.currentQuestionIndex + 1));
    };
  }

  document.querySelectorAll(`.${prefix}-sound-btn`).forEach(btn => {
    btn.onclick = () => {
      const sound = btn.dataset.sound;
      triggerLocalAndRemoteSound(sound);
    };
  });

  const muteBtn = document.getElementById(`${prefix}-mute-btn`);
  if (muteBtn) {
    muteBtn.onclick = () => {
      gameState.muted = !gameState.muted;
      if (window.gameAudio) {
        window.gameAudio.setMuted(gameState.muted);
      }
      saveState();
      render();
    };
  }

  const autoToggle = document.getElementById(`${prefix}-auto-advance-toggle`);
  if (autoToggle) {
    autoToggle.onchange = (e) => {
      gameState.autoReveal = e.target.checked;
      saveState();
      broadcastState();
      render();
    };
  }
}
