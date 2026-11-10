# Chess from the First Move

A clean, interactive, single-page chess repertoire and tactical patterns guide designed for complete beginners. Plain-language explanations, no jargon without a definition, accessible keyboard controls, and zero build steps.

Live site: [https://thenewghandi.github.io/chess-for-beginners/](https://thenewghandi.github.io/chess-for-beginners/)

---

## Architecture & File Structure

```text
chess-for-beginners/
├── index.html        # Semantic HTML structure, accessible ARIA roles, Google Fonts
├── styles.css        # Slate blue / pale grey board themes, amber highlights, responsive styles
├── app.js            # Board rendering, move playback, puzzle interaction, diagnostics
├── data.js           # Content repository (all openings and puzzles defined as JSON)
├── vendor/
│   └── chess.js      # Vendored chess rules engine (v0.12.0)
└── README.md         # Guide on usage and how to extend content
```

- **Zero dependencies & no build step**: Uses native browser ES6 JavaScript and CSS Grid.
- **Move legality**: Handled entirely offline by `vendor/chess.js`.
- **Display**: Custom-drawn CSS Grid board with text Unicode chess symbols appended with `\uFE0E` to prevent emoji rendering.
- **Accessibility**: Every square is a `<button>` with an `aria-label` (e.g. `e4 white pawn`), visible focus rings, and screen-reader announcements.
- **Themes**: Light and dark mode support via CSS variables, automatically respecting system preferences.

---

## How to Add New Openings

All opening repertoires are stored in `data.js` inside the `OPENINGS` array. To add a new opening line, append an object with the following structure:

```javascript
{
  id: 'french-defense',
  name: 'French Defense',
  side: 'black', // 'white' or 'black' (sets default board orientation)
  blurb: 'A solid, counter-attacking response against 1.e4.',
  moves: [
    {
      uci: 'e2e4',
      san: 'e4',
      note: 'White stakes an immediate claim in the center and frees the bishop.'
    },
    {
      uci: 'e7e6',
      san: 'e6',
      note: 'Black prepares to contest the center with d7-d5 while maintaining a solid pawn chain.'
    },
    {
      uci: 'd2d4',
      san: 'd4',
      note: 'White occupies the center with a second pawn.'
    },
    {
      uci: 'd7d5',
      san: 'd5',
      note: 'Black strikes in the center, challenging White’s e4 pawn.'
    }
  ]
}
```

### Guidelines for Openings:
- `uci`: The standard coordinate notation: from-square followed by to-square (e.g. `e2e4`, `g1f3`, `e1g1` for castling).
- `san`: The standard algebraic notation (e.g. `e4`, `Nf3`, `O-O`).
- `note`: A one-sentence explanation in plain beginner-friendly language explaining the purpose of the move.

---

## How to Add New Puzzles

All tactical puzzles are stored in `data.js` inside the `PUZZLES` array. To add a new puzzle, append an object with the following schema:

```javascript
{
  id: 'double-attack',
  title: 'Double Attack',
  fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
  solution: 'c4f7', // UCI move: from-square and to-square
  hint: 'Look for a sacrifice on the vulnerable f7 square.',
  explanation: 'Bxf7+ strips away Black’s king safety and forces Black’s king into the open.'
}
```

### Guidelines for Puzzles:
- `fen`: Standard Forsyth-Edwards Notation string for the starting position.
- `solution`: UCI coordinate string for the winning move (e.g. `b5c7`, `a1a7`, `e1e8`, `h5f7`).
- `hint`: A gentle clue pointing to the tactical motif without giving away the answer directly.
- `explanation`: Clear breakdown of why the move wins and what happens next.

---

## Automated Legality Self-Check

Every time the page loads, `app.js` runs a diagnostic self-check in the browser console. It simulates every move of every opening and confirms that every puzzle FEN and solution is legal according to `chess.js`.

Open your browser's Developer Tools (F12 or Ctrl+Shift+I) to inspect the diagnostic report.

