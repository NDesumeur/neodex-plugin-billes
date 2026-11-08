# Billes (Marbles)

Peg solitaire, the marble puzzle on a board full of holes: on each move, a marble jumps over its neighbour and removes it. You must finish with a single marble, and in the centre for a perfect game.

*Version française : [README.md](README.md)*

## How to play

1. Click a marble: it lifts, and the holes it can land in light up in yellow.
2. Click one of those holes: the marble jumps in a straight line (horizontal or vertical, never diagonal) over its neighbour, and the jumped marble leaves the board.
3. The game ends when no jump is possible any more.

- **Backspace** or **Ctrl+Z** undoes the last jump, without limit: you learn by going back, even after the game is over.
- At the top, the counter shows the marbles left and the number of jumps still possible.
- **New game** resets the board; a click after the end restarts too.

## The boards

Pick one from the list; each starts with a single empty hole.

- **English cross**: 33 holes, 32 marbles, empty hole in the centre. The classic: 4 possible jumps at the start.
- **French cross**: 37 holes, 36 marbles, with four extra holes in the corners of the cross.
- **Small cross**: 21 marbles, to learn.
- **Pyramid**: 15 marbles in a triangle.

## End of game

- **Perfect: in the centre!**: one marble is left, in the middle hole of the board.
- **A single marble!**: one marble is left somewhere else.
- **No more jumps**: several marbles are left; the number is shown.

## Statistics

The Records panel shows, for the chosen board, your **record** (the fewest marbles left) and your **wins** (games finished with a single marble, out of the games played).

## Data and sync

Your records per board and your wins are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Billes → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
