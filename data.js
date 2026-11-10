/**
 * Chess from the first move - Opening repertoire & tactical puzzles
 * All data is isolated here so content can be added or updated without touching application logic.
 */

const OPENINGS = [
  {
    id: 'italian-game',
    name: 'Italian Game',
    side: 'white',
    blurb: 'One of the oldest and most natural openings in chess. White stakes a claim in the center, develops knights and bishops quickly, and aims directly at Black’s vulnerable f7 pawn.',
    moves: [
      {
        uci: 'e2e4',
        san: 'e4',
        note: 'White stakes a claim in the central e4 square and frees both the queen and light-squared bishop for action.'
      },
      {
        uci: 'e7e5',
        san: 'e5',
        note: 'Black responds symmetrically to contest the center and open lines for their own pieces.'
      },
      {
        uci: 'g1f3',
        san: 'Nf3',
        note: 'White develops the knight toward the center, putting immediate pressure on Black’s e5 pawn.'
      },
      {
        uci: 'b8c6',
        san: 'Nc6',
        note: 'Black develops a knight to defend the e5 pawn and challenge key central squares.'
      },
      {
        uci: 'f1c4',
        san: 'Bc4',
        note: 'The signature move: White places the bishop on an active diagonal aimed right at Black’s vulnerable f7 pawn.'
      },
      {
        uci: 'g8f6',
        san: 'Nf6',
        note: 'Black develops their king’s knight to attack White’s e4 pawn and prepare king safety.'
      },
      {
        uci: 'd2d3',
        san: 'd3',
        note: 'White solidifies the e4 pawn and opens a clear path for the dark-squared bishop.'
      },
      {
        uci: 'f8c5',
        san: 'Bc5',
        note: 'Black places the bishop on a mirror post, controlling the center and eyeing White’s kingside.'
      },
      {
        uci: 'e1g1',
        san: 'O-O',
        note: 'White castles kingside: the king tucks safely into the corner and the rook slides toward the center.'
      },
      {
        uci: 'd7d6',
        san: 'd6',
        note: 'Black reinforces e5 and opens a diagonal for their light-squared bishop to enter the fray.'
      }
    ]
  },
  {
    id: 'london-system',
    name: 'London System',
    side: 'white',
    blurb: 'A solid, harmonious setup for White that works against almost anything Black plays. You build an impenetrable pawn pyramid and develop all your pieces with minimal risk.',
    moves: [
      {
        uci: 'd2d4',
        san: 'd4',
        note: 'White plants a pawn firmly in the center, staking a claim that cannot be attacked by a knight on the next move.'
      },
      {
        uci: 'd7d5',
        san: 'd5',
        note: 'Black establishes an equal pawn foothold to prevent White from taking full central control.'
      },
      {
        uci: 'c1f4',
        san: 'Bf4',
        note: 'The hallmark of the London: White develops the dark-squared bishop outside the pawn chain before locking the center.'
      },
      {
        uci: 'g8f6',
        san: 'Nf6',
        note: 'Black develops the king’s knight, controlling central squares and preparing early castling.'
      },
      {
        uci: 'e2e3',
        san: 'e3',
        note: 'White builds a sturdy pawn pyramid supporting d4 while keeping the bishop active outside.'
      },
      {
        uci: 'e7e6',
        san: 'e6',
        note: 'Black reinforces d5 and opens a path for the dark-squared bishop.'
      },
      {
        uci: 'g1f3',
        san: 'Nf3',
        note: 'White develops the knight to f3, adding another layer of control over the vital e5 square.'
      },
      {
        uci: 'f8d6',
        san: 'Bd6',
        note: 'Black challenges White’s prized bishop along the light diagonal.'
      },
      {
        uci: 'f4g3',
        san: 'Bg3',
        note: 'White steps the bishop back to g3, ready to open the h-file for the rook if Black decides to trade.'
      },
      {
        uci: 'e8g8',
        san: 'O-O',
        note: 'Black castles kingside to tuck the king behind pawns before central action begins.'
      },
      {
        uci: 'f1d3',
        san: 'Bd3',
        note: 'White finishes minor piece development, aiming both bishops menacingly toward Black’s kingside.'
      }
    ]
  },
  {
    id: 'queens-gambit-declined',
    name: 'Queen’s Gambit Declined',
    side: 'black',
    blurb: 'A classical, resilient defense for Black against 1.d4. Black refuses to yield the center, maintaining a rock-solid pawn barrier while safely developing.',
    moves: [
      {
        uci: 'd2d4',
        san: 'd4',
        note: 'White claims the central d4 square and opens diagonals for piece development.'
      },
      {
        uci: 'd7d5',
        san: 'd5',
        note: 'Black stakes an equal claim in the center to stop White’s central expansion.'
      },
      {
        uci: 'c2c4',
        san: 'c4',
        note: 'White offers a flank pawn (the Queen’s Gambit) to lure Black’s central pawn away from d5.'
      },
      {
        uci: 'e7e6',
        san: 'e6',
        note: 'Black declines the gambit, solidly reinforcing the central d5 pawn with a defending pawn.'
      },
      {
        uci: 'b1c3',
        san: 'Nc3',
        note: 'White develops a knight to put a second attacker onto the contested d5 pawn.'
      },
      {
        uci: 'g8f6',
        san: 'Nf6',
        note: 'Black develops a knight to add a second defender to d5 and contest the center.'
      },
      {
        uci: 'c1g5',
        san: 'Bg5',
        note: 'White pins Black’s knight to the queen, threatening to remove d5’s main guardian.'
      },
      {
        uci: 'f8e7',
        san: 'Be7',
        note: 'Black calmly develops the bishop to break the pin on the knight and prepare kingside castling.'
      }
    ]
  },
  {
    id: 'stopping-scholars-mate',
    name: 'Stopping Scholar’s Mate',
    side: 'black',
    blurb: 'Beginners frequently face aggressive early queen attacks trying for a four-move checkmate on f7. Here is the calm, foolproof refutation.',
    moves: [
      {
        uci: 'e2e4',
        san: 'e4',
        note: 'White pushes the king’s pawn into the center to open paths for quick attacking pieces.'
      },
      {
        uci: 'e7e5',
        san: 'e5',
        note: 'Black occupies the center symmetrically and prepares natural piece development.'
      },
      {
        uci: 'f1c4',
        san: 'Bc4',
        note: 'White aims the bishop directly at f7, the weakest square in Black’s camp because only the king defends it.'
      },
      {
        uci: 'b8c6',
        san: 'Nc6',
        note: 'Black calmly develops a knight to defend e5 without creating any unnecessary weaknesses.'
      },
      {
        uci: 'd1h5',
        san: 'Qh5',
        note: 'White brings the queen out aggressively, threatening immediate checkmate with Qxf7#.'
      },
      {
        uci: 'g7g6',
        san: 'g6',
        note: 'Black shuts the queen’s path to f7 with a pawn while attacking the queen, forcing it to retreat.'
      },
      {
        uci: 'h5f3',
        san: 'Qf3',
        note: 'White retreats the queen to f3, renewing the checkmate threat against f7 along the diagonal.'
      },
      {
        uci: 'd8f6',
        san: 'Qf6',
        note: 'Black blocks the threat cleanly by offering a queen trade and defending f7, leaving White’s queen completely disarmed.'
      }
    ]
  }
];

const PUZZLES = [
  {
    id: 'knight-fork',
    title: 'Knight Fork',
    fen: 'r3k3/pp1p1ppp/8/1N6/8/8/PPP2PPP/4K3 w - - 0 1',
    solution: 'b5c7',
    hint: 'Look for a square where your knight can check the king and attack the rook simultaneously.',
    explanation: 'Nc7+ forks Black’s king and rook! Because the king is in check, Black must move it, allowing White to capture the undefended rook on a8 on the next move.'
  },
  {
    id: 'skewer',
    title: 'Skewer',
    fen: '8/3k3r/5pp1/8/8/8/5PPP/R5K1 w - - 0 1',
    solution: 'a1a7',
    hint: 'Check the king along the 7th rank so it is forced to move out of the way of the piece behind it.',
    explanation: 'Ra7+ skewers the king and rook! Unlike a pin, the more valuable piece (the king) is in front. When the king steps aside, White’s rook captures Black’s rook on h7.'
  },
  {
    id: 'back-rank-mate',
    title: 'Back-Rank Mate',
    fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    solution: 'e1e8',
    hint: 'Black’s king is trapped behind its own shield of pawns. Deliver a check on the 8th rank.',
    explanation: 'Re8# is checkmate! Black’s king is blocked by its own pawns on f7, g7, and h7 and has no escape squares (the "pawn shield trap").'
  },
  {
    id: 'scholars-mate',
    title: 'Scholar’s Mate',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 4',
    solution: 'h5f7',
    hint: 'Combine your queen and bishop against the lone defender on the f7 square.',
    explanation: 'Qxf7# is checkmate! Protected by the bishop on c4, the queen delivers checkmate right in front of Black’s king with no defenders left.'
  },
  {
    id: 'absolute-pin',
    title: 'Absolute Pin',
    fen: '4k3/4qppp/8/8/8/5N2/5PPP/3R2K1 w - - 0 1',
    solution: 'd1e1',
    hint: 'Slide your rook to the open e-file where Black’s king and queen are aligned.',
    explanation: 'Re1! Defended by the knight on f3, White’s rook pins Black’s queen to their king. Black cannot move the queen away because exposing the king to check is illegal.'
  },
  {
    id: 'discovered-attack',
    title: 'Discovered Attack',
    fen: '3q1rk1/5ppp/5n2/8/8/3B4/5PPP/3R2K1 w - - 0 1',
    solution: 'd3h7',
    hint: 'Move your bishop with check to uncover a lethal ray from your rook against Black’s queen.',
    explanation: 'Bxh7+! The bishop delivers check to Black’s king, uncovering the rook on d1 which directly attacks Black’s queen on d8. Black must escape check, leaving the queen lost to Rxd8.'
  },
  {
    id: 'removing-the-defender',
    title: 'Removing the Defender',
    fen: 'r1bq1rk1/pp3ppp/5n2/6B1/4Q3/8/PPB2PPP/R4RK1 w - - 0 1',
    solution: 'g5f6',
    hint: 'Black’s knight on f6 is the only piece protecting the king against a deadly Queen and Bishop battery aiming at h7.',
    explanation: 'Bxf6! White captures the knight that was solely defending h7. If Black recaptures with gxf6 or Qxf6, White plays Qxh7# with instant checkmate!'
  },
  {
    id: 'hanging-piece',
    title: 'Free Hanging Piece',
    fen: 'r4rk1/ppp2ppp/8/b7/Q7/8/PPP2PPP/R4RK1 w - - 0 1',
    solution: 'a4a5',
    hint: 'Black left a minor piece completely undefended on the queenside. Sweep it up with your queen.',
    explanation: 'Qxa5 captures the undefended ("hanging") bishop for free! Checking whether your pieces and opponent’s pieces have defenders is the foundation of chess tactics.'
  }
];

if (typeof window !== 'undefined') {
  window.OPENINGS = OPENINGS;
  window.PUZZLES = PUZZLES;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OPENINGS, PUZZLES };
}

