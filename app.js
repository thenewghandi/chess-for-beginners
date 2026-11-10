/**
 * Chess from the first move - Application Logic
 * No frameworks, no build step. Plain ES6 JavaScript.
 * Reads content strictly from data.js and move legality from vendor/chess.js.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Console Self-Check (Runs on page load)
  // ---------------------------------------------------------------------------
  function runSelfCheck() {
    console.group('♟ Chess Guide: Self-Check Diagnostics');
    let errorsFound = false;

    if (typeof Chess === 'undefined') {
      console.error('[Self-Check FAILED] chess.js is not loaded.');
      console.groupEnd();
      return;
    }

    if (!window.OPENINGS || !Array.isArray(window.OPENINGS)) {
      console.error('[Self-Check FAILED] window.OPENINGS missing or not an array.');
      errorsFound = true;
    } else {
      console.log(`[Self-Check] Validating ${window.OPENINGS.length} opening repertoires...`);
      window.OPENINGS.forEach((op, opIndex) => {
        const game = new Chess();
        op.moves.forEach((m, mIndex) => {
          const from = m.uci.slice(0, 2);
          const to = m.uci.slice(2, 4);
          const promotion = m.uci[4] || undefined;
          const res = game.move({ from, to, promotion });
          if (!res) {
            console.error(`[Self-Check Error] Opening "${op.name}" move ${mIndex + 1} (${m.uci}) is illegal.`);
            errorsFound = true;
          }
        });
        console.log(`  ✓ Opening ${opIndex + 1}: "${op.name}" (${op.moves.length} moves verified)`);
      });
    }

    if (!window.PUZZLES || !Array.isArray(window.PUZZLES)) {
      console.error('[Self-Check FAILED] window.PUZZLES missing or not an array.');
      errorsFound = true;
    } else {
      console.log(`[Self-Check] Validating ${window.PUZZLES.length} tactical puzzles...`);
      window.PUZZLES.forEach((pz, pzIndex) => {
        try {
          const game = new Chess(pz.fen);
          const from = pz.solution.slice(0, 2);
          const to = pz.solution.slice(2, 4);
          const promotion = pz.solution[4] || undefined;
          const res = game.move({ from, to, promotion });
          if (!res) {
            console.error(`[Self-Check Error] Puzzle "${pz.title}" solution (${pz.solution}) is illegal.`);
            errorsFound = true;
          } else {
            console.log(`  ✓ Puzzle ${pzIndex + 1}: "${pz.title}" -> ${res.san} verified`);
          }
        } catch (err) {
          console.error(`[Self-Check Error] Puzzle "${pz.title}" failed with FEN error:`, err);
          errorsFound = true;
        }
      });
    }

    if (!errorsFound) {
      console.log('✓ [Self-Check PASSED] All opening lines and puzzle solutions are 100% legal!');
    } else {
      console.warn('⚠ [Self-Check WARNING] One or more legality issues were identified above.');
    }
    console.groupEnd();
  }

  // ---------------------------------------------------------------------------
  // 2. Constants & Piece Unicode Symbols
  // ---------------------------------------------------------------------------
  // Append \uFE0E to each Unicode chess glyph so browsers never render them as emoji.
  const PIECE_SYMBOLS = {
    w: {
      k: '♔\uFE0E',
      q: '♕\uFE0E',
      r: '♖\uFE0E',
      b: '♗\uFE0E',
      n: '♘\uFE0E',
      p: '♙\uFE0E'
    },
    b: {
      k: '♚\uFE0E',
      q: '♛\uFE0E',
      r: '♜\uFE0E',
      b: '♝\uFE0E',
      n: '♞\uFE0E',
      p: '♟\uFE0E'
    }
  };

  const PIECE_NAMES = {
    p: 'pawn',
    n: 'knight',
    b: 'bishop',
    r: 'rook',
    q: 'queen',
    k: 'king'
  };

  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Screen reader announcer
  function announce(msg) {
    const sr = document.getElementById('sr-announcements');
    if (sr) {
      sr.textContent = '';
      setTimeout(() => { sr.textContent = msg; }, 50);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Theme Toggle (Light / Dark)
  // ---------------------------------------------------------------------------
  function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    const savedTheme = localStorage.getItem('chess_guide_theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (themeIcon && themeText) {
        if (theme === 'dark') {
          themeIcon.textContent = '☾';
          themeText.textContent = 'Dark';
          toggleBtn.setAttribute('aria-label', 'Switch to light mode');
        } else {
          themeIcon.textContent = '☼';
          themeText.textContent = 'Light';
          toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
      }
      localStorage.setItem('chess_guide_theme', theme);
    }

    applyTheme(initialTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Board Renderer Utility
  // ---------------------------------------------------------------------------
  /**
   * Render an 8x8 chess board into a container.
   * @param {HTMLElement} container
   * @param {Chess} gameInstance
   * @param {Object} options
   *   flipped: boolean (Black at bottom if true)
   *   lastMove: { from, to, rookFrom, rookTo }
   *   selectedSquare: string ('e4')
   *   targetSquares: Array of square names
   *   onSquareClick: function(square, piece)
   */
  function renderBoard(container, gameInstance, options = {}) {
    container.innerHTML = '';
    const {
      flipped = false,
      lastMove = null,
      selectedSquare = null,
      targetSquares = [],
      onSquareClick = null
    } = options;

    const rankOrder = flipped ? [...RANKS].reverse() : RANKS;
    const fileOrder = flipped ? [...FILES].reverse() : FILES;

    // Check highlights for castling
    const highlightSquares = new Set();
    if (lastMove) {
      if (lastMove.from) highlightSquares.add(lastMove.from);
      if (lastMove.to) highlightSquares.add(lastMove.to);
      if (lastMove.rookFrom) highlightSquares.add(lastMove.rookFrom);
      if (lastMove.rookTo) highlightSquares.add(lastMove.rookTo);
    }

    const targetSet = new Set(targetSquares);

    rankOrder.forEach((rank, rIdx) => {
      fileOrder.forEach((file, fIdx) => {
        const square = file + rank;
        const fileNum = file.charCodeAt(0) - 97;
        const rankNum = parseInt(rank, 10);
        const isDark = (fileNum + rankNum) % 2 === 0;

        const piece = gameInstance.get(square);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `board-square ${isDark ? 'square-dark' : 'square-light'}`;
        btn.dataset.square = square;

        if (highlightSquares.has(square)) {
          btn.classList.add('highlight-last-move');
        }

        if (selectedSquare === square) {
          btn.classList.add('highlight-selected');
          btn.setAttribute('aria-pressed', 'true');
        }

        if (targetSet.has(square)) {
          if (piece) {
            btn.classList.add('is-target-capture');
          } else {
            btn.classList.add('is-target-move');
          }
        }

        // Accessible description
        if (piece) {
          const colorName = piece.color === 'w' ? 'white' : 'black';
          const pieceName = PIECE_NAMES[piece.type] || piece.type;
          btn.setAttribute('aria-label', `${square} ${colorName} ${pieceName}`);
        } else {
          btn.setAttribute('aria-label', `${square} empty`);
        }

        // Coordinate labels on board edges
        // Leftmost file gets rank number
        if (fIdx === 0) {
          const rankLabel = document.createElement('span');
          rankLabel.className = 'coord-rank';
          rankLabel.setAttribute('aria-hidden', 'true');
          rankLabel.textContent = rank;
          btn.appendChild(rankLabel);
        }
        // Bottommost rank gets file letter
        if (rIdx === 7) {
          const fileLabel = document.createElement('span');
          fileLabel.className = 'coord-file';
          fileLabel.setAttribute('aria-hidden', 'true');
          fileLabel.textContent = file;
          btn.appendChild(fileLabel);
        }

        // Piece symbol
        if (piece) {
          const pieceSpan = document.createElement('span');
          pieceSpan.className = `piece-glyph ${piece.color === 'w' ? 'piece-white' : 'piece-black'}`;
          pieceSpan.setAttribute('aria-hidden', 'true');
          pieceSpan.textContent = PIECE_SYMBOLS[piece.color][piece.type];
          btn.appendChild(pieceSpan);
        }

        if (onSquareClick) {
          btn.addEventListener('click', () => onSquareClick(square, piece));
        }

        container.appendChild(btn);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Openings Repertoire Controller
  // ---------------------------------------------------------------------------
  function initOpenings() {
    const tabsContainer = document.getElementById('opening-tabs');
    const boardContainer = document.getElementById('opening-board');
    const titleEl = document.getElementById('opening-title');
    const blurbEl = document.getElementById('opening-blurb');
    const movesGrid = document.getElementById('opening-moves-grid');
    const explHeader = document.getElementById('explanation-header');
    const explText = document.getElementById('explanation-text');

    const resetBtn = document.getElementById('opening-reset-btn');
    const backBtn = document.getElementById('opening-back-btn');
    const nextBtn = document.getElementById('opening-next-btn');
    const flipBtn = document.getElementById('opening-flip-btn');

    if (!tabsContainer || !boardContainer || !window.OPENINGS) return;

    let currentOpeningIdx = 0;
    let currentMoveIdx = -1; // -1 means starting board
    let isFlipped = false;
    let game = new Chess();
    let moveHistory = []; // array of { uci, san, note, from, to, rookFrom, rookTo }

    function getOpening() {
      return window.OPENINGS[currentOpeningIdx];
    }

    function buildMoveHistory(opening) {
      const g = new Chess();
      const list = [];
      opening.moves.forEach(m => {
        const from = m.uci.slice(0, 2);
        const to = m.uci.slice(2, 4);
        const promotion = m.uci[4] || undefined;
        const res = g.move({ from, to, promotion });

        let rookFrom = null;
        let rookTo = null;
        if (res && (res.flags.includes('k') || res.flags.includes('q'))) {
          // Castling move! Determine rook move
          if (res.to === 'g1') { rookFrom = 'h1'; rookTo = 'f1'; }
          else if (res.to === 'c1') { rookFrom = 'a1'; rookTo = 'd1'; }
          else if (res.to === 'g8') { rookFrom = 'h8'; rookTo = 'f8'; }
          else if (res.to === 'c8') { rookFrom = 'a8'; rookTo = 'd8'; }
        }

        list.push({
          uci: m.uci,
          san: res ? res.san : m.san,
          note: m.note,
          from,
          to,
          rookFrom,
          rookTo
        });
      });
      return list;
    }

    function replayToCurrentMove() {
      game = new Chess();
      let lastMove = null;
      for (let i = 0; i <= currentMoveIdx; i++) {
        const m = moveHistory[i];
        game.move({
          from: m.from,
          to: m.to,
          promotion: m.uci[4] || undefined
        });
        if (i === currentMoveIdx) {
          lastMove = m;
        }
      }

      // Render board
      renderBoard(boardContainer, game, {
        flipped: isFlipped,
        lastMove: lastMove
      });

      // Update Move list pills
      renderMovePills();

      // Update Explanation Card
      updateExplanation();

      // Update Buttons
      backBtn.disabled = (currentMoveIdx < 0);
      nextBtn.disabled = (currentMoveIdx >= moveHistory.length - 1);
    }

    function renderMovePills() {
      movesGrid.innerHTML = '';
      moveHistory.forEach((m, idx) => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = `move-pill ${idx === currentMoveIdx ? 'current-move' : ''}`;
        
        const moveNumber = Math.floor(idx / 2) + 1;
        const isWhite = idx % 2 === 0;
        const prefix = isWhite ? `${moveNumber}. ` : `${moveNumber}... `;
        pill.textContent = `${prefix}${m.san}`;
        pill.setAttribute('aria-label', `Jump to move ${prefix}${m.san}`);

        pill.addEventListener('click', () => {
          currentMoveIdx = idx;
          replayToCurrentMove();
          announce(`Showing move ${prefix}${m.san}: ${m.note}`);
        });

        movesGrid.appendChild(pill);
      });
    }

    function updateExplanation() {
      if (currentMoveIdx < 0) {
        explHeader.textContent = 'Starting Position';
        explText.innerHTML = 'Press <strong>Next</strong> or the <strong>Right Arrow key</strong> to step through this opening.';
      } else {
        const m = moveHistory[currentMoveIdx];
        const moveNumber = Math.floor(currentMoveIdx / 2) + 1;
        const isWhite = currentMoveIdx % 2 === 0;
        const sideText = isWhite ? 'White' : 'Black';
        explHeader.textContent = `Move ${moveNumber} (${sideText}) • ${m.san}`;
        explText.textContent = m.note;
      }
    }

    function selectOpening(index) {
      currentOpeningIdx = index;
      const op = getOpening();
      titleEl.textContent = op.name;
      blurbEl.textContent = op.blurb;
      
      // Default board orientation: flip if opening is specifically from Black's perspective
      isFlipped = (op.side === 'black');

      moveHistory = buildMoveHistory(op);
      currentMoveIdx = -1; // Start before move 1
      replayToCurrentMove();

      // Update tabs styling
      const tabs = tabsContainer.querySelectorAll('.selector-tab');
      tabs.forEach((tab, tIdx) => {
        if (tIdx === index) {
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
        } else {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        }
      });

      announce(`Loaded opening ${op.name}. ${op.blurb}`);
    }

    // Render Tabs
    tabsContainer.innerHTML = '';
    window.OPENINGS.forEach((op, idx) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'presentation');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `selector-tab ${idx === 0 ? 'active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      btn.innerHTML = `${op.name} <span class="badge-tag">${op.side === 'white' ? 'White' : 'Black'}</span>`;

      btn.addEventListener('click', () => selectOpening(idx));
      li.appendChild(btn);
      tabsContainer.appendChild(li);
    });

    // Control button handlers
    resetBtn.addEventListener('click', () => {
      currentMoveIdx = -1;
      replayToCurrentMove();
      announce('Reset board to the starting position.');
    });

    backBtn.addEventListener('click', () => {
      if (currentMoveIdx >= 0) {
        currentMoveIdx--;
        replayToCurrentMove();
        if (currentMoveIdx >= 0) {
          announce(`Back to move ${moveHistory[currentMoveIdx].san}`);
        } else {
          announce('Returned to starting board.');
        }
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentMoveIdx < moveHistory.length - 1) {
        currentMoveIdx++;
        replayToCurrentMove();
        const m = moveHistory[currentMoveIdx];
        announce(`Played ${m.san}. ${m.note}`);
      }
    });

    flipBtn.addEventListener('click', () => {
      isFlipped = !isFlipped;
      replayToCurrentMove();
      announce(`Flipped board. Now viewing from ${isFlipped ? 'Black' : 'White'} side.`);
    });

    // Keyboard navigation (Left / Right arrow keys when openings section is focused or active)
    document.addEventListener('keydown', (e) => {
      const activeElem = document.activeElement;
      // Don't intercept if user is typing in an input
      if (activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA')) return;

      const openingsSection = document.getElementById('openings');
      if (!openingsSection) return;
      const rect = openingsSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        if (e.key === 'ArrowRight' && !nextBtn.disabled) {
          e.preventDefault();
          nextBtn.click();
        } else if (e.key === 'ArrowLeft' && !backBtn.disabled) {
          e.preventDefault();
          backBtn.click();
        }
      }
    });

    // Initialize first opening
    selectOpening(0);
  }

  // ---------------------------------------------------------------------------
  // 6. Tactical Puzzles Controller
  // ---------------------------------------------------------------------------
  function initTactics() {
    const tabsContainer = document.getElementById('puzzle-tabs');
    const boardContainer = document.getElementById('puzzle-board');
    const titleEl = document.getElementById('puzzle-title');
    const statusBadge = document.getElementById('puzzle-status-badge');
    const turnEl = document.getElementById('puzzle-turn');
    const feedbackBox = document.getElementById('puzzle-feedback');
    const resetBtn = document.getElementById('puzzle-reset-btn');
    const hintBtn = document.getElementById('puzzle-hint-btn');

    if (!tabsContainer || !boardContainer || !window.PUZZLES) return;

    let currentPuzzleIdx = 0;
    let puzzleGame = null;
    let selectedSquare = null;
    let legalTargets = [];
    let lastMove = null;
    let isSolved = false;
    const solvedSet = new Set();

    function getPuzzle() {
      return window.PUZZLES[currentPuzzleIdx];
    }

    function resetPuzzle() {
      const pz = getPuzzle();
      puzzleGame = new Chess(pz.fen);
      selectedSquare = null;
      legalTargets = [];
      lastMove = null;
      isSolved = solvedSet.has(pz.id);

      hideFeedback();
      updateStatusBadge();

      const turnColor = puzzleGame.turn() === 'w' ? 'White' : 'Black';
      turnEl.textContent = `${turnColor} to move and win.`;

      renderPuzzleBoard();
      announce(`Loaded puzzle "${pz.title}". ${turnColor} to move.`);
    }

    function updateStatusBadge() {
      const pz = getPuzzle();
      if (solvedSet.has(pz.id)) {
        statusBadge.textContent = 'Solved ✓';
        statusBadge.classList.add('is-solved');
      } else {
        statusBadge.textContent = 'Unsolved';
        statusBadge.classList.remove('is-solved');
      }
    }

    function renderPuzzleBoard() {
      renderBoard(boardContainer, puzzleGame, {
        flipped: false,
        lastMove: lastMove,
        selectedSquare: selectedSquare,
        targetSquares: legalTargets,
        onSquareClick: handleSquareClick
      });
    }

    function showFeedback(type, title, message) {
      feedbackBox.className = `puzzle-feedback show feedback-${type}`;
      feedbackBox.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
      announce(`${title}: ${message}`);
    }

    function hideFeedback() {
      feedbackBox.className = 'puzzle-feedback';
      feedbackBox.innerHTML = '';
    }

    function handleSquareClick(square, piece) {
      const pz = getPuzzle();
      const currentTurn = puzzleGame.turn();

      // If already solved, do not accept further moves
      if (isSolved) {
        return;
      }

      // Step 1: User clicks on their own piece to select it
      if (piece && piece.color === currentTurn) {
        if (selectedSquare === square) {
          // Deselect
          selectedSquare = null;
          legalTargets = [];
        } else {
          selectedSquare = square;
          const moves = puzzleGame.moves({ square: square, verbose: true });
          legalTargets = moves.map(m => m.to);
        }
        renderPuzzleBoard();
        return;
      }

      // Step 2: If a piece was selected, user clicks a destination square
      if (selectedSquare) {
        const from = selectedSquare;
        const to = square;

        // Check if move is legal in chess.js
        const moveAttempt = puzzleGame.move({ from, to, promotion: 'q' });

        if (!moveAttempt) {
          // Illegal move according to chess rules
          selectedSquare = null;
          legalTargets = [];
          renderPuzzleBoard();
          return;
        }

        // Compare with required solution (UCI match: from+to)
        const attemptedUci = from + to;
        const expectedUci = pz.solution.toLowerCase();

        if (attemptedUci === expectedUci) {
          // CORRECT MOVE!
          isSolved = true;
          solvedSet.add(pz.id);
          lastMove = { from, to };
          selectedSquare = null;
          legalTargets = [];

          updateStatusBadge();
          updateTabBadges();
          renderPuzzleBoard();

          showFeedback('success', 'Brilliant! Correct move.', pz.explanation);
        } else {
          // WRONG MOVE: Undo the move, show gentle feedback, allow retry
          puzzleGame.undo();
          selectedSquare = null;
          legalTargets = [];
          renderPuzzleBoard();

          showFeedback(
            'error',
            'Not quite.',
            'That move doesn’t win the tactic or checkmate. Take another look at the position and try again!'
          );
        }
      }
    }

    function selectPuzzle(index) {
      currentPuzzleIdx = index;
      const pz = getPuzzle();
      titleEl.textContent = pz.title;

      // Update tabs styling
      const tabs = tabsContainer.querySelectorAll('.selector-tab');
      tabs.forEach((tab, tIdx) => {
        if (tIdx === index) {
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
        } else {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        }
      });

      resetPuzzle();
    }

    function updateTabBadges() {
      const tabs = tabsContainer.querySelectorAll('.selector-tab');
      window.PUZZLES.forEach((pz, idx) => {
        const tab = tabs[idx];
        if (tab) {
          const isDone = solvedSet.has(pz.id);
          tab.innerHTML = `${pz.title} <span class="badge-tag">${isDone ? '✓' : idx + 1}</span>`;
        }
      });
    }

    // Render Tabs
    tabsContainer.innerHTML = '';
    window.PUZZLES.forEach((pz, idx) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'presentation');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `selector-tab ${idx === 0 ? 'active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      btn.innerHTML = `${pz.title} <span class="badge-tag">${idx + 1}</span>`;

      btn.addEventListener('click', () => selectPuzzle(idx));
      li.appendChild(btn);
      tabsContainer.appendChild(li);
    });

    // Control button handlers
    resetBtn.addEventListener('click', () => {
      resetPuzzle();
    });

    hintBtn.addEventListener('click', () => {
      const pz = getPuzzle();
      showFeedback('hint', 'Tactical Hint', pz.hint);
    });

    // Initialize first puzzle
    selectPuzzle(0);
  }

  // ---------------------------------------------------------------------------
  // 7. Initialization
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    runSelfCheck();
    initTheme();
    initOpenings();
    initTactics();
  });

})();
