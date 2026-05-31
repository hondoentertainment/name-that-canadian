/* global QUESTIONS_PER_ROUND, FINAL_ROUND_NUM, TIMER_OPTIONS, WIKI_IMAGE_OVERRIDES, ROUND_OVERLAY_COPY, KEYBOARD_SHORTCUTS */

let CATEGORIES = {};
let CATEGORY_META = {};
let gameState = {};
let timerInterval = null;
let wikipediaImages = {};
let categoriesLoaded = false;

const isHostPage = document.body.dataset.page === 'host';
const isShowPage = document.body.dataset.page === 'show';

const DEFAULT_STATE = {
  view: 'show',
  currentQuestionIndex: 0,
  revealedFacts: 1,
  timeLeft: 40,
  timerMax: 40,
  timerDuration: 40,
  timerRunning: false,
  answerRevealed: false,
  autoReveal: true,
  muted: false,
  activeCategory: 'celebrities',
  teams: [],
  showScoreboard: false,
  shuffleQuestions: false,
  questionOrder: [],
  theme: 'midnight',
  bigText: false,
  screenOverlay: null,
  pendingQuestionIndex: null,
  gameComplete: false
};

function getWikiSearchTitle(name) {
  return WIKI_IMAGE_OVERRIDES[name] || name;
}

function shouldSyncToPresenter() {
  return isHostPage;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestionOrder(categoryKey) {
  const base = CATEGORIES[categoryKey] || [];
  const r1 = [], r2 = [], fin = [];
  base.forEach((q, i) => {
    if (q.roundNum === 1) r1.push(i);
    else if (q.roundNum === 2) r2.push(i);
    else fin.push(i);
  });
  return [...shuffleArray(r1), ...shuffleArray(r2), ...fin];
}

function getBaseQuestions() {
  const cat = gameState.activeCategory || 'celebrities';
  return CATEGORIES[cat] || CATEGORIES.celebrities || [];
}

function getQuestions() {
  const base = getBaseQuestions();
  if (gameState.shuffleQuestions && gameState.questionOrder?.length === base.length) {
    return gameState.questionOrder.map(i => base[i]);
  }
  return base;
}

function getTimerDuration() {
  return gameState.timerDuration || 40;
}

function applyTimerDuration() {
  const d = getTimerDuration();
  gameState.timerDuration = d;
  gameState.timeLeft = d;
  gameState.timerMax = d;
}

function getRevealThresholds() {
  const max = gameState.timerMax || getTimerDuration();
  return {
    t2: Math.floor(max * 0.75),
    t2Low: Math.floor(max * 0.5) + 1,
    t3: Math.floor(max * 0.5),
    t3Low: Math.floor(max * 0.25) + 1,
    t4: Math.floor(max * 0.25)
  };
}

async function loadCategories() {
  try {
    const res = await fetch('data/categories.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    CATEGORY_META = data.categoryMeta || {};
    CATEGORIES = {};
    Object.keys(CATEGORY_META).forEach(k => {
      if (Array.isArray(data[k])) CATEGORIES[k] = data[k];
    });
    categoriesLoaded = true;
  } catch (e) {
    console.error('Failed to load categories.json', e);
    categoriesLoaded = false;
  }
}

function updateState(newState) {
  gameState = { ...gameState, ...newState };
  saveState();
  broadcastState();
  render();
}

function saveState() {
  localStorage.setItem('name_that_canadian_state', JSON.stringify(gameState));
}

function loadState() {
  gameState = { ...DEFAULT_STATE };
  const saved = localStorage.getItem('name_that_canadian_state');
  if (saved) {
    try {
      gameState = { ...DEFAULT_STATE, ...JSON.parse(saved) };
      if (!gameState.timerMax) gameState.timerMax = gameState.timeLeft || getTimerDuration();
      if (!gameState.timerDuration) gameState.timerDuration = 40;
      const base = getBaseQuestions();
      if (base.length && gameState.currentQuestionIndex >= base.length) {
        gameState.currentQuestionIndex = 0;
      }
      if (window.gameAudio) window.gameAudio.setMuted(gameState.muted);
    } catch (e) {
      console.error('Error loading saved state', e);
    }
  }
  gameState.view = isHostPage ? 'host' : 'show';
}

function broadcastState() {
  if (window.gameSync && isHostPage) {
    window.gameSync.broadcastState(gameState);
  }
}

function applyTheme(theme) {
  document.body.dataset.theme = theme || 'midnight';
  document.body.classList.toggle('big-text', !!gameState.bigText);
}

function stopTimerInterval() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (window.gameAudio) window.gameAudio.stopSuspense();
}

function startTimer() {
  if (gameState.timerRunning || gameState.screenOverlay) return;
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
    const th = getRevealThresholds();

    if (nextTime < 0) {
      stopTimerInterval();
      gameState.timerRunning = false;
      gameState.timeLeft = 0;
      gameState.revealedFacts = 4;
      gameState.answerRevealed = true;
      if (window.gameAudio) window.gameAudio.playIncorrect();
      if (shouldSyncToPresenter()) window.gameSync.triggerSound('incorrect');
      checkGameEnd();
      saveState();
      broadcastState();
      render();
      return;
    }

    if (nextTime <= 5 && nextTime > 0) {
      if (window.gameAudio) window.gameAudio.playWarning();
      if (shouldSyncToPresenter()) window.gameSync.triggerSound('warning');
    } else if (nextTime > 0) {
      if (window.gameAudio) window.gameAudio.playTick();
      if (shouldSyncToPresenter()) window.gameSync.triggerSound('tick');
    }

    if (gameState.autoReveal) {
      if (nextTime <= th.t2 && nextTime >= th.t2Low && nextRevealed < 2) {
        nextRevealed = 2;
        triggerLocalAndRemoteSound('reveal');
      } else if (nextTime <= th.t3 && nextTime >= th.t3Low && nextRevealed < 3) {
        nextRevealed = 3;
        triggerLocalAndRemoteSound('reveal');
      } else if (nextTime <= th.t4 && nextTime > 0 && nextRevealed < 4) {
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
  if (shouldSyncToPresenter()) window.gameSync.triggerSound(soundName);
}

function getTransitionOverlay(targetIdx) {
  const qs = getQuestions();
  if (targetIdx <= 0 || targetIdx >= qs.length) return null;
  const q = qs[targetIdx];
  if (targetIdx === 5 && q.roundNum === 2 && q.qNum === 1) return { type: 'round2_start', ...ROUND_OVERLAY_COPY.round2_start };
  if (targetIdx === 10 && q.roundNum === FINAL_ROUND_NUM) return { type: 'final_intro', ...ROUND_OVERLAY_COPY.final_intro };
  return null;
}

function getTransitionOverlayAfter(currentIdx) {
  const qs = getQuestions();
  if (currentIdx === 4 && qs[4]?.roundNum === 1) return { type: 'round1_end', ...ROUND_OVERLAY_COPY.round1_end };
  if (currentIdx === 9 && qs[9]?.roundNum === 2) return { type: 'round2_end', ...ROUND_OVERLAY_COPY.round2_end };
  return null;
}

function showScreenOverlay(overlay, pendingIdx) {
  gameState.screenOverlay = overlay;
  gameState.pendingQuestionIndex = pendingIdx ?? null;
  stopTimerInterval();
  gameState.timerRunning = false;
  saveState();
  broadcastState();
  render();
}

function dismissScreenOverlay() {
  const pending = gameState.pendingQuestionIndex;
  gameState.screenOverlay = null;
  gameState.pendingQuestionIndex = null;
  if (pending !== null && pending !== undefined) {
    selectQuestion(pending, { skipOverlay: true });
  } else {
    saveState();
    broadcastState();
    render();
  }
}

function showPodium() {
  gameState.gameComplete = true;
  gameState.screenOverlay = { type: 'podium', title: '🏆 Final Scores', subtitle: 'Thanks for playing!' };
  triggerLocalAndRemoteSound('fanfare');
  saveState();
  broadcastState();
  render();
}

function checkGameEnd() {
  if (gameState.currentQuestionIndex === getQuestions().length - 1 && gameState.answerRevealed) {
    showPodium();
  }
}

function selectQuestion(idx, options = {}) {
  const qs = getQuestions();
  if (idx < 0 || idx >= qs.length) return;

  if (!options.skipOverlay && !options.fromOverlay) {
    const overlay = getTransitionOverlay(idx);
    if (overlay) {
      showScreenOverlay(overlay, idx);
      return;
    }
  }

  stopTimerInterval();
  gameState.currentQuestionIndex = idx;
  gameState.gameComplete = false;
  applyTimerDuration();
  gameState.revealedFacts = 1;
  gameState.timerRunning = false;
  gameState.answerRevealed = false;
  gameState.screenOverlay = null;
  gameState.pendingQuestionIndex = null;

  saveState();
  broadcastState();
  render();

  prefetchWikipediaImage(qs[idx].canadian, qs[idx].imageUrl);
}

function goToNextQuestion() {
  const idx = gameState.currentQuestionIndex;
  const nextIdx = Math.min(getQuestions().length - 1, idx + 1);
  if (nextIdx === idx) return;

  if (gameState.answerRevealed) {
    const afterOverlay = getTransitionOverlayAfter(idx);
    if (afterOverlay) {
      showScreenOverlay(afterOverlay, nextIdx);
      return;
    }
  }
  selectQuestion(nextIdx);
}

function goToPrevQuestion() {
  selectQuestion(Math.max(0, gameState.currentQuestionIndex - 1), { skipOverlay: true });
}

function revealNextFact() {
  if (gameState.screenOverlay || gameState.revealedFacts >= 4) return;
  gameState.revealedFacts += 1;
  triggerLocalAndRemoteSound('reveal');
  saveState();
  broadcastState();
  render();
}

function revealAnswer() {
  if (gameState.screenOverlay) return;
  stopTimerInterval();
  gameState.timerRunning = false;
  gameState.answerRevealed = true;
  triggerLocalAndRemoteSound('correct');
  saveState();
  broadcastState();
  render();
  checkGameEnd();
}

function adjustTime(amount) {
  let newTime = gameState.timeLeft + amount;
  if (newTime < 0) newTime = 0;
  if (newTime > 99) newTime = 99;
  gameState.timeLeft = newTime;
  if (newTime > gameState.timerMax) gameState.timerMax = newTime;
  saveState();
  broadcastState();
  render();
}

function setTimerDuration(seconds) {
  stopTimerInterval();
  gameState.timerDuration = seconds;
  applyTimerDuration();
  gameState.timerRunning = false;
  gameState.revealedFacts = gameState.answerRevealed ? 4 : Math.min(gameState.revealedFacts, 4);
  saveState();
  broadcastState();
  render();
}

function changeCategory(categoryKey) {
  if (!CATEGORIES[categoryKey]) return;
  stopTimerInterval();
  gameState.activeCategory = categoryKey;
  gameState.currentQuestionIndex = 0;
  gameState.gameComplete = false;
  gameState.screenOverlay = null;
  if (gameState.shuffleQuestions) {
    gameState.questionOrder = buildQuestionOrder(categoryKey);
  }
  applyTimerDuration();
  gameState.revealedFacts = 1;
  gameState.timerRunning = false;
  gameState.answerRevealed = false;
  getQuestions().forEach(q => prefetchWikipediaImage(q.canadian, q.imageUrl));
  saveState();
  broadcastState();
  render();
}

function toggleShuffle(enabled) {
  gameState.shuffleQuestions = enabled;
  if (enabled) {
    gameState.questionOrder = buildQuestionOrder(gameState.activeCategory);
  } else {
    gameState.questionOrder = [];
  }
  gameState.currentQuestionIndex = 0;
  saveState();
  broadcastState();
  render();
}

function addTeam(name) {
  if (!name || name.trim() === '') return;
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  if (!gameState.teams) gameState.teams = [];
  gameState.teams.push({ id, name: name.trim(), score: 0 });
  saveState();
  broadcastState();
  render();
}

function removeTeam(id) {
  if (!gameState.teams) return;
  gameState.teams = gameState.teams.filter(t => t.id !== id);
  saveState();
  broadcastState();
  render();
}

function adjustScore(id, amount) {
  if (!gameState.teams) return;
  const team = gameState.teams.find(t => t.id === id);
  if (team) {
    team.score += amount;
    saveState();
    broadcastState();
    render();
  }
}

function awardTeam(id, amount) {
  adjustScore(id, amount);
  triggerLocalAndRemoteSound('correct');
}

function clearScores() {
  if (!gameState.teams) return;
  gameState.teams.forEach(t => { t.score = 0; });
  saveState();
  broadcastState();
  render();
}

function exportScores() {
  if (!gameState.teams?.length) return;
  const sorted = [...gameState.teams].sort((a, b) => b.score - a.score);
  const lines = sorted.map((t, i) => `${i + 1}. ${t.name}: ${t.score} pts`);
  const text = `Name That Canadian — Scores\n${new Date().toLocaleString()}\n\n${lines.join('\n')}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Scores copied to clipboard!');
  }).catch(() => {
    prompt('Copy scores:', text);
  });
}

function playAgain() {
  stopTimerInterval();
  gameState.currentQuestionIndex = 0;
  gameState.gameComplete = false;
  gameState.screenOverlay = null;
  gameState.pendingQuestionIndex = null;
  if (gameState.shuffleQuestions) {
    gameState.questionOrder = buildQuestionOrder(gameState.activeCategory);
  }
  applyTimerDuration();
  gameState.revealedFacts = 1;
  gameState.timerRunning = false;
  gameState.answerRevealed = false;
  saveState();
  broadcastState();
  render();
}

function resetGame() {
  stopTimerInterval();
  gameState = { ...DEFAULT_STATE, view: isHostPage ? 'host' : 'show' };
  applyTimerDuration();
  saveState();
  broadcastState();
  applyTheme(gameState.theme);
  render();
}

function resetQuestion() {
  stopTimerInterval();
  applyTimerDuration();
  gameState.revealedFacts = 1;
  gameState.timerRunning = false;
  gameState.answerRevealed = false;
  saveState();
  broadcastState();
  render();
}

function showToast(msg) {
  let el = document.getElementById('game-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'game-toast';
    el.className = 'game-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 3000);
}

function prefetchWikipediaImage(canadianName, imageUrl) {
  if (wikipediaImages[canadianName]) return;
  if (imageUrl) {
    wikipediaImages[canadianName] = imageUrl;
    return;
  }
  const searchName = getWikiSearchTitle(canadianName);
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(searchName)}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const pages = data?.query?.pages;
      if (!pages) return;
      const pageId = Object.keys(pages)[0];
      if (pageId !== '-1' && pages[pageId].thumbnail) {
        wikipediaImages[canadianName] = pages[pageId].thumbnail.source;
        if (gameState.answerRevealed && getQuestions()[gameState.currentQuestionIndex]?.canadian === canadianName) {
          render();
        }
      }
    })
    .catch(err => console.warn('Failed to fetch image for ' + canadianName, err));
}

function populateCategorySelects() {
  document.querySelectorAll('[data-category-select]').forEach(select => {
    const current = select.value;
    select.innerHTML = '';
    Object.entries(CATEGORY_META).forEach(([key, meta]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = meta.label;
      select.appendChild(opt);
    });
    select.value = gameState.activeCategory || current || 'celebrities';
  });
}

function renderScreenOverlay(targetPrefix) {
  const overlayEl = document.getElementById(`${targetPrefix}-screen-overlay`);
  if (!overlayEl) return;

  if (!gameState.screenOverlay) {
    overlayEl.classList.add('hidden');
    overlayEl.classList.remove('visible');
    return;
  }

  overlayEl.classList.remove('hidden');
  overlayEl.classList.add('visible');

  const o = gameState.screenOverlay;
  const titleEl = document.getElementById(`${targetPrefix}-overlay-title`);
  const subEl = document.getElementById(`${targetPrefix}-overlay-subtitle`);
  const podiumEl = document.getElementById(`${targetPrefix}-overlay-podium`);
  const continueBtn = overlayEl.querySelector('.btn-dismiss-overlay');

  if (titleEl) titleEl.textContent = o.title || '';
  if (subEl) subEl.textContent = o.subtitle || '';

  if (podiumEl) {
    if (o.type === 'podium' && gameState.teams?.length) {
      podiumEl.classList.remove('hidden');
      const sorted = [...gameState.teams].sort((a, b) => b.score - a.score);
      const medals = ['🥇', '🥈', '🥉'];
      podiumEl.innerHTML = sorted.map((t, i) => `
        <div class="podium-entry ${i < 3 ? 'podium-top' : ''}">
          <span class="podium-rank">${medals[i] || `#${i + 1}`}</span>
          <span class="podium-name">${t.name}</span>
          <span class="podium-score">${t.score} pts</span>
        </div>
      `).join('');
    } else {
      podiumEl.classList.add('hidden');
      podiumEl.innerHTML = '';
    }
  }

  if (continueBtn) continueBtn.style.display = isHostPage ? '' : 'none';
}

function renderPresenterScreen(targetPrefix) {
  if (!categoriesLoaded || !getQuestions().length) return;
  const question = getQuestions()[gameState.currentQuestionIndex];
  if (!question) return;

  document.getElementById(`${targetPrefix}-round-name`).textContent = question.roundName;
  const qNumEl = document.getElementById(`${targetPrefix}-q-num`);
  qNumEl.textContent = question.roundNum === FINAL_ROUND_NUM
    ? 'Final Showstopper'
    : `Question ${question.qNum} of ${QUESTIONS_PER_ROUND}`;

  const timeLeft = gameState.timeLeft;
  const timerMax = gameState.timerMax || getTimerDuration();
  const timePercent = Math.min(1, timeLeft / timerMax);
  document.getElementById(`${targetPrefix}-timer-value`).textContent = timeLeft;

  const ring = document.getElementById(`${targetPrefix}-timer-ring`);
  if (ring) {
    const radius = parseFloat(ring.getAttribute('r')) || 54;
    const circumference = 2 * Math.PI * radius;
    ring.setAttribute('stroke-dasharray', circumference);
    ring.style.strokeDashoffset = circumference - (timePercent * circumference);
    const timerCircle = document.getElementById(`${targetPrefix}-timer`);
    timerCircle.className = 'timer-circle';
    if (timeLeft <= 5) timerCircle.classList.add('low-time-critical');
    else if (timeLeft <= 15) timerCircle.classList.add('low-time');
  }

  const factsContainer = document.getElementById(`${targetPrefix}-facts-container`);
  factsContainer.innerHTML = '';
  question.facts.forEach((factText, index) => {
    const factNum = index + 1;
    const isRevealed = gameState.revealedFacts >= factNum;
    const card = document.createElement('div');
    card.className = `fact-card ${isRevealed ? 'revealed' : 'locked'}`;
    card.innerHTML = isRevealed
      ? `<div class="fact-badge">${factNum}</div><div class="fact-text">${factText}</div>`
      : `<div class="fact-badge locked"><span class="lock-icon">🔒</span></div><div class="fact-text locked-text">Fact Locked</div>`;
    factsContainer.appendChild(card);
  });

  const revealOverlay = document.getElementById(`${targetPrefix}-reveal-overlay`);
  if (gameState.answerRevealed && !gameState.screenOverlay) {
    revealOverlay.classList.remove('hidden');
    revealOverlay.classList.add('visible');
    document.getElementById(`${targetPrefix}-answer-name`).textContent = question.canadian;
    document.getElementById(`${targetPrefix}-answer-notes`).textContent = question.notes;
    const imgEl = document.getElementById(`${targetPrefix}-answer-image`);
    const imgUrl = question.imageUrl || wikipediaImages[question.canadian];
    if (imgUrl) {
      imgEl.src = imgUrl;
      imgEl.classList.remove('hidden');
      document.getElementById(`${targetPrefix}-avatar-fallback`).classList.add('hidden');
    } else {
      imgEl.classList.add('hidden');
      const fallback = document.getElementById(`${targetPrefix}-avatar-fallback`);
      fallback.classList.remove('hidden');
      fallback.textContent = question.canadian.split(' ').map(n => n[0]).join('').slice(0, 3);
    }
  } else {
    revealOverlay.classList.add('hidden');
    revealOverlay.classList.remove('visible');
  }

  const leaderboardContainer = document.getElementById(`${targetPrefix}-leaderboard-container`);
  if (leaderboardContainer) {
    if (gameState.teams?.length > 0 && gameState.showScoreboard && !gameState.screenOverlay) {
      leaderboardContainer.classList.remove('hidden');
      const entriesContainer = document.getElementById(`${targetPrefix}-leaderboard-entries`);
      entriesContainer.innerHTML = '';
      [...gameState.teams].sort((a, b) => b.score - a.score).forEach((team, index) => {
        const entry = document.createElement('div');
        entry.className = 'leaderboard-entry';
        entry.innerHTML = `
          <div class="leaderboard-rank-info">
            <span class="leaderboard-rank">${index === 0 ? '👑' : `#${index + 1}`}</span>
            <span class="leaderboard-team-name">${team.name}</span>
          </div>
          <span class="leaderboard-score">${team.score} pts</span>`;
        entriesContainer.appendChild(entry);
      });
    } else {
      leaderboardContainer.classList.add('hidden');
    }
  }

  renderScreenOverlay(targetPrefix);
}

function renderAdminScreen(targetPrefix) {
  if (!categoriesLoaded || !getQuestions().length) return;
  const question = getQuestions()[gameState.currentQuestionIndex];

  const playBtn = document.getElementById(`${targetPrefix}-play-btn`);
  if (playBtn) {
    const disabled = !!gameState.screenOverlay;
    playBtn.disabled = disabled;
    if (gameState.timerRunning) {
      playBtn.innerHTML = '⏸️ Pause Timer';
      playBtn.className = 'btn btn-warning btn-glow host-btn-xl';
    } else {
      playBtn.innerHTML = '▶️ Start Timer';
      playBtn.className = 'btn btn-success btn-glow host-btn-xl';
    }
  }

  document.getElementById(`${targetPrefix}-fact-progress`) && (document.getElementById(`${targetPrefix}-fact-progress`).textContent = `Hints: ${gameState.revealedFacts}/4`);

  const nowRound = document.getElementById(`${targetPrefix}-now-round`);
  const nowQ = document.getElementById(`${targetPrefix}-now-q`);
  if (nowRound) nowRound.textContent = question.roundName;
  if (nowQ) {
    nowQ.textContent = question.roundNum === FINAL_ROUND_NUM
      ? 'Final Showstopper'
      : `Question ${question.qNum} of ${QUESTIONS_PER_ROUND}`;
  }

  const prevBtn = document.getElementById(`${targetPrefix}-prev-q-btn`);
  const nextBtn = document.getElementById(`${targetPrefix}-next-q-btn`);
  const resetBtn = document.getElementById(`${targetPrefix}-reset-q-btn`);
  const blocked = !!gameState.screenOverlay;
  if (prevBtn) prevBtn.disabled = blocked || gameState.currentQuestionIndex <= 0;
  if (nextBtn) nextBtn.disabled = blocked || gameState.currentQuestionIndex >= getQuestions().length - 1;
  if (resetBtn) resetBtn.disabled = blocked;

  const nextFactBtn = document.getElementById(`${targetPrefix}-next-fact-btn`);
  if (nextFactBtn) nextFactBtn.disabled = gameState.revealedFacts >= 4 || !!gameState.screenOverlay;

  const answerBtn = document.getElementById(`${targetPrefix}-reveal-answer-btn`);
  if (answerBtn) {
    if (gameState.answerRevealed) {
      answerBtn.textContent = '✓ Answer Revealed';
      answerBtn.className = 'btn btn-disabled host-btn-lg';
      answerBtn.disabled = true;
    } else {
      answerBtn.textContent = '🔓 Reveal Answer';
      answerBtn.className = 'btn btn-primary btn-glow host-btn-lg';
      answerBtn.disabled = !!gameState.screenOverlay;
    }
  }

  const cheatTitle = document.getElementById(`${targetPrefix}-cheat-title`);
  const cheatRound = document.getElementById(`${targetPrefix}-cheat-round`);
  const cheatNotes = document.getElementById(`${targetPrefix}-cheat-notes`);
  if (cheatTitle) cheatTitle.textContent = `Q${question.id}: ${question.canadian}`;
  if (cheatRound) cheatRound.textContent = question.roundName;
  if (cheatNotes) cheatNotes.textContent = question.notes;

  const cheatFactsList = document.getElementById(`${targetPrefix}-cheat-facts`);
  if (cheatFactsList) {
    cheatFactsList.innerHTML = '';
    question.facts.forEach((fact, i) => {
      const li = document.createElement('li');
      li.className = gameState.revealedFacts > i ? 'revealed' : 'locked';
      li.innerHTML = `<strong>Fact ${i + 1}:</strong> ${fact}`;
      cheatFactsList.appendChild(li);
    });
  }

  const timeTracker = document.getElementById(`${targetPrefix}-time-tracker`);
  if (timeTracker) {
    timeTracker.textContent = `${gameState.timeLeft}s`;
    timeTracker.className = gameState.timeLeft <= 5 ? 'time-left-tracker low' : 'time-left-tracker';
  }

  const timerSelect = document.getElementById(`${targetPrefix}-timer-duration`);
  if (timerSelect) timerSelect.value = String(getTimerDuration());

  const qList = document.getElementById(`${targetPrefix}-q-list`);
  if (qList) {
    qList.innerHTML = '';
    getQuestions().forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = `admin-q-item ${gameState.currentQuestionIndex === idx ? 'active' : ''}`;
      card.onclick = () => selectQuestion(idx);
      card.innerHTML = `
        <div class="q-num-badge">Q${q.id}</div>
        <div class="q-info">
          <div class="q-name">${q.canadian}</div>
          <div class="q-round">${q.roundNum === FINAL_ROUND_NUM ? 'Final' : 'Round ' + q.roundNum}</div>
        </div>`;
      qList.appendChild(card);
    });
  }

  const muteBtn = document.getElementById(`${targetPrefix}-mute-btn`);
  if (muteBtn) {
    muteBtn.innerHTML = gameState.muted ? '🔇 Unmute Controller' : '🔊 Mute Controller';
    muteBtn.className = gameState.muted ? 'btn btn-outline btn-active-red' : 'btn btn-outline';
  }

  const syncStatus = document.getElementById(`${targetPrefix}-sync-status`);
  if (syncStatus && window.gameSync) {
    if (window.gameSync.isPresenterConnected) {
      syncStatus.className = 'sync-indicator connected';
      syncStatus.innerHTML = "<span class='pulse-dot'></span> Display Connected";
    } else {
      syncStatus.className = 'sync-indicator disconnected';
      syncStatus.innerHTML = 'Display Offline — open the show link on your TV';
    }
  } else if (syncStatus) {
    syncStatus.classList.add('hidden');
  }

  const autoToggle = document.getElementById(`${targetPrefix}-auto-advance-toggle`);
  if (autoToggle) autoToggle.checked = gameState.autoReveal;

  const sbToggle = document.getElementById(`${targetPrefix}-show-scoreboard-toggle`);
  if (sbToggle) sbToggle.checked = !!gameState.showScoreboard;

  const shuffleToggle = document.getElementById(`${targetPrefix}-shuffle-toggle`);
  if (shuffleToggle) shuffleToggle.checked = !!gameState.shuffleQuestions;

  const catSelect = document.getElementById(`${targetPrefix}-category-select`);
  if (catSelect) catSelect.value = gameState.activeCategory || 'celebrities';

  const overlayPanel = document.getElementById(`${targetPrefix}-overlay-controls`);
  if (overlayPanel) {
    overlayPanel.classList.toggle('hidden', !gameState.screenOverlay);
  }

  const awardPanel = document.getElementById(`${targetPrefix}-award-panel`);
  if (awardPanel) {
    awardPanel.classList.toggle('hidden', !gameState.answerRevealed || !!gameState.screenOverlay);
    if (gameState.answerRevealed && gameState.teams?.length) {
      awardPanel.innerHTML = `<div class="award-panel-title">⭐ Award Points</div>
        <div class="award-buttons">${gameState.teams.map(t => `
          <div class="award-team-row">
            <span>${t.name}</span>
            <div>
              <button class="btn btn-outline btn-sm" onclick="awardTeam('${t.id}', 5)">+5</button>
              <button class="btn btn-success btn-sm" onclick="awardTeam('${t.id}', 10)">+10</button>
            </div>
          </div>`).join('')}</div>`;
    }
  }

  const teamsList = document.getElementById(`${targetPrefix}-teams-list`);
  if (teamsList) {
    teamsList.innerHTML = '';
    if (gameState.teams?.length) {
      gameState.teams.forEach(team => {
        const row = document.createElement('div');
        row.className = 'team-manager-row';
        row.innerHTML = `
          <span class="team-name">${team.name}</span>
          <div class="team-score-controls">
            <button class="btn btn-outline btn-sm" onclick="adjustScore('${team.id}', -10)">-10</button>
            <span class="team-score">${team.score}</span>
            <button class="btn btn-outline btn-sm" onclick="adjustScore('${team.id}', 10)">+10</button>
            <button class="btn btn-outline btn-active-red btn-sm" onclick="removeTeam('${team.id}')">🗑️</button>
          </div>`;
        teamsList.appendChild(row);
      });
    } else {
      teamsList.innerHTML = '<div class="empty-teams-msg">No teams added yet.</div>';
    }
  }

  updateMobileHostDock();
}

function render() {
  const container = document.getElementById('view-container');
  if (!container) return;

  applyTheme(gameState.theme);
  document.body.classList.toggle('big-text', !!gameState.bigText);

  if (!categoriesLoaded) {
    const err = document.getElementById('categories-load-error');
    if (err) err.classList.remove('hidden');
    return;
  }

  if (isShowPage) {
    container.dataset.currentView = 'show';
    document.getElementById('view-show')?.classList.remove('hidden');
    renderPresenterScreen('solo-presenter');
  }

  if (isHostPage) {
    container.dataset.currentView = 'host';
    document.getElementById('view-host')?.classList.remove('hidden');
    renderAdminScreen('solo-admin');
  }
}

function setupAdminActionListeners(prefix) {
  document.getElementById(`${prefix}-play-btn`)?.addEventListener('click', () => {
    gameState.timerRunning ? pauseTimer() : startTimer();
  });

  document.getElementById(`${prefix}-reset-q-btn`)?.addEventListener('click', resetQuestion);

  document.getElementById(`${prefix}-time-plus`)?.addEventListener('click', () => adjustTime(5));
  document.getElementById(`${prefix}-time-minus`)?.addEventListener('click', () => adjustTime(-5));
  document.getElementById(`${prefix}-next-fact-btn`)?.addEventListener('click', revealNextFact);
  document.getElementById(`${prefix}-reveal-answer-btn`)?.addEventListener('click', revealAnswer);
  document.getElementById(`${prefix}-prev-q-btn`)?.addEventListener('click', goToPrevQuestion);
  document.getElementById(`${prefix}-next-q-btn`)?.addEventListener('click', goToNextQuestion);

  document.querySelectorAll(`.${prefix}-sound-btn`).forEach(btn => {
    btn.addEventListener('click', () => triggerLocalAndRemoteSound(btn.dataset.sound));
  });

  document.getElementById(`${prefix}-mute-btn`)?.addEventListener('click', () => {
    gameState.muted = !gameState.muted;
    window.gameAudio?.setMuted(gameState.muted);
    saveState();
    render();
  });

  document.getElementById(`${prefix}-auto-advance-toggle`)?.addEventListener('change', e => {
    gameState.autoReveal = e.target.checked;
    saveState();
    broadcastState();
    render();
  });

  document.getElementById(`${prefix}-show-scoreboard-toggle`)?.addEventListener('change', e => {
    gameState.showScoreboard = e.target.checked;
    saveState();
    broadcastState();
    render();
  });

  document.getElementById(`${prefix}-shuffle-toggle`)?.addEventListener('change', e => {
    toggleShuffle(e.target.checked);
  });

  document.getElementById(`${prefix}-category-select`)?.addEventListener('change', e => {
    changeCategory(e.target.value);
  });

  document.getElementById(`${prefix}-timer-duration`)?.addEventListener('change', e => {
    setTimerDuration(parseInt(e.target.value, 10));
  });

  document.getElementById(`${prefix}-clear-scores-btn`)?.addEventListener('click', () => {
    if (confirm('Clear all team scores?')) clearScores();
  });

  document.getElementById(`${prefix}-export-scores-btn`)?.addEventListener('click', exportScores);
  document.getElementById(`${prefix}-play-again-btn`)?.addEventListener('click', playAgain);
  document.getElementById(`${prefix}-dismiss-overlay-btn`)?.addEventListener('click', dismissScreenOverlay);

  const teamInput = document.getElementById(`${prefix}-team-input`);
  const addTeamBtn = document.getElementById(`${prefix}-add-team-btn`);
  const doAdd = () => { addTeam(teamInput.value); teamInput.value = ''; };
  addTeamBtn?.addEventListener('click', doAdd);
  teamInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });
}

function setupKeyboardShortcuts() {
  if (!isHostPage) return;

  document.addEventListener('keydown', e => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (gameState.screenOverlay && e.key !== 'Enter') return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        gameState.timerRunning ? pauseTimer() : startTimer();
        break;
      case 'n':
      case 'N':
        revealNextFact();
        break;
      case 'r':
      case 'R':
        if (!gameState.answerRevealed) revealAnswer();
        break;
      case 'ArrowLeft':
        goToPrevQuestion();
        break;
      case 'ArrowRight':
        goToNextQuestion();
        break;
      case 'Enter':
        if (gameState.screenOverlay) dismissScreenOverlay();
        break;
      case '1':
        triggerLocalAndRemoteSound('correct');
        break;
      case '2':
        triggerLocalAndRemoteSound('incorrect');
        break;
      case '3':
        triggerLocalAndRemoteSound('reveal');
        break;
      case '4':
        triggerLocalAndRemoteSound('fanfare');
        break;
    }
  });
}

function isMobileDevice() {
  return document.body.classList.contains('host-page')
    || document.body.classList.contains('mobile-only-app')
    || window.matchMedia('(max-width: 768px)').matches;
}

function setupMobileDetection() {
  const update = () => {
    document.body.classList.toggle('is-mobile', isMobileDevice());
  };
  update();
  window.addEventListener('resize', update);
}

function setupMobileHostDock(prefix) {
  const dockId = prefix === 'admin' ? 'admin-mobile-dock' : 'solo-mobile-dock';
  const dock = document.getElementById(dockId);
  if (!dock) return;

  const actions = {
    prev: () => goToPrevQuestion(),
    next: () => goToNextQuestion(),
    play: () => { gameState.timerRunning ? pauseTimer() : startTimer(); },
    hint: () => revealNextFact(),
    reveal: () => { if (!gameState.answerRevealed) revealAnswer(); }
  };

  dock.querySelectorAll('[data-dock-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.dockAction;
      if (actions[action]) actions[action]();
    });
  });
}

function updateMobileHostDock() {
  document.querySelectorAll('.mobile-host-dock').forEach(dock => {
    if (dock.classList.contains('hidden')) return;
    const playBtn = dock.querySelector('[data-dock-action="play"]');
    const hintBtn = dock.querySelector('[data-dock-action="hint"]');
    const revealBtn = dock.querySelector('[data-dock-action="reveal"]');
    if (playBtn) {
      playBtn.textContent = gameState.timerRunning ? '⏸️' : '▶️';
      playBtn.setAttribute('aria-label', gameState.timerRunning ? 'Pause timer' : 'Start timer');
      playBtn.classList.toggle('dock-btn-warning', gameState.timerRunning);
      playBtn.classList.toggle('dock-btn-primary', !gameState.timerRunning);
    }
    if (hintBtn) hintBtn.disabled = gameState.revealedFacts >= 4 || !!gameState.screenOverlay;
    if (revealBtn) revealBtn.disabled = gameState.answerRevealed || !!gameState.screenOverlay;
  });
}

function setupTouchFeedback() {
  document.addEventListener('touchstart', () => {}, { passive: true });
}

function setupMobileAudioUnlock() {
  const unlock = () => {
    window.gameAudio?.init();
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('click', unlock);
  };
  document.addEventListener('touchstart', unlock, { once: true, passive: true });
  document.addEventListener('click', unlock, { once: true });
}

function setupThemePicker() {
  document.querySelectorAll('[data-theme-option]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeOption === (gameState.theme || 'midnight'));
    btn.addEventListener('click', () => {
      gameState.theme = btn.dataset.themeOption;
      applyTheme(gameState.theme);
      saveState();
      document.querySelectorAll('[data-theme-option]').forEach(b => {
        b.classList.toggle('active', b.dataset.themeOption === gameState.theme);
      });
    });
  });
  document.getElementById('big-text-toggle')?.addEventListener('change', e => {
    gameState.bigText = e.target.checked;
    saveState();
    render();
  });
  const bigTextEl = document.getElementById('big-text-toggle');
  if (bigTextEl) bigTextEl.checked = !!gameState.bigText;
}

function setupFullscreenHide() {
  document.addEventListener('fullscreenchange', () => {
    document.body.classList.toggle('is-fullscreen', !!document.fullscreenElement);
  });
}

async function initApp() {
  await loadCategories();
  loadState();
  applyTheme(gameState.theme);

  if (isHostPage) {
    populateCategorySelects();

    document.querySelectorAll('.btn-reset-game').forEach(btn => {
      btn.onclick = () => { if (confirm('Reset the entire game?')) resetGame(); };
    });

    if (window.gameSync) {
      window.gameSync.setAdminMode(true);
      window.gameSync.onRequestStateReceived(() => window.gameSync.broadcastState(gameState));
      window.gameSync.onPresenterStatusChange(connected => {
        render();
        if (connected) showToast('Display connected!');
      });
      window.gameSync.startHeartbeatMonitor(9000);
      setInterval(() => window.gameSync.pingPresenter(), 3000);
    }

    setupAdminActionListeners('solo-admin');
    setupThemePicker();
    setupMobileHostDock('solo-admin');
    setupKeyboardShortcuts();

    getQuestions().forEach(q => prefetchWikipediaImage(q.canadian, q.imageUrl));

    document.querySelectorAll('.btn-dismiss-overlay').forEach(btn => {
      btn.onclick = dismissScreenOverlay;
    });
  }

  if (isShowPage) {
    if (window.gameSync) {
      window.gameSync.setPresenterMode(true);
      window.gameSync.onStateReceived(remoteState => {
        gameState = { ...remoteState, view: 'show' };
        applyTheme(gameState.theme);
        if (window.gameAudio) window.gameAudio.setMuted(gameState.muted);
        render();
      });
      window.gameSync.onSoundReceived(soundName => {
        if (!window.gameAudio) return;
        const map = {
          tick: 'playTick',
          warning: 'playWarning',
          reveal: 'playReveal',
          correct: 'playCorrect',
          incorrect: 'playIncorrect',
          fanfare: 'playFanfare'
        };
        window.gameAudio[map[soundName]]?.();
      });
      window.gameSync.requestState();
    }

    getQuestions().forEach(q => prefetchWikipediaImage(q.canadian, q.imageUrl));
  }

  setupMobileDetection();
  setupTouchFeedback();
  setupMobileAudioUnlock();
  setupFullscreenHide();
  render();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

window.addEventListener('DOMContentLoaded', initApp);

// Expose for inline onclick handlers
window.adjustScore = adjustScore;
window.awardTeam = awardTeam;
window.removeTeam = removeTeam;
