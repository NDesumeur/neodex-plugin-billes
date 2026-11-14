# Billes (Marbles)

Peg solitaire, the marble puzzle on a board full of holes: on each move, a marble jumps over its neighbour and removes it. You must finish with a single marble, and on the golden hole for a perfect game.

*Version française : [README.md](README.md)*

## How to play

1. Click a glass marble: it lifts, and the holes it can land in light up in yellow.
2. Click one of those holes: the marble hops in an arc over its neighbour, and the jumped marble rolls into the gutter around the wooden board, where removed marbles line up.
3. The game ends when no jump is possible any more.

- **Backspace** or **Ctrl+Z** undoes the last jump, without limit, even after the game is over.
- At the top, the counter shows the marbles left, and the **indicator** tells you live whether you can still end with a single marble ("ONE MARBLE POSSIBLE") or not any more. It is computed by a solver, so it is never wrong.
- **New game** resets the board; a click after the end restarts too.

## The boards

Pick one from the list. Each starts from an empty hole chosen so that ending with one marble is always possible, and the golden hole shows where to finish for a perfect.

- **English cross**: 33 holes, 32 marbles, start and goal in the centre. The classic.
- **French cross**: 37 holes, with four extra holes in the corners. From the centre it can never end with one marble, so it starts from a hole at the top.
- **Small cross**: 21 marbles, to learn.
- **Pyramid**: 15 marbles in a triangle; here you also jump diagonally, along the sides of the triangle.
- **Asymmetric**: 39 holes, a cross with uneven arms.

## Puzzles

The **Puzzles** tab offers 30 puzzles: a few marbles already placed, and a golden hole where the last marble must end. They range from a few jumps to more than twenty, on seven boards (the five above, the German cross, the diamond and the big triangle). Each one has at least one solution.

- **3 stars**: solved without undo; **2 stars**: with three undos at most; **1 star**: solved anyway.
- A puzzle unlocks once the previous one is solved.

## Statistics

The Records panel shows your **record** on the chosen board (the fewest marbles left), your **wins** (games ended with a single marble), your **perfects**, your solved puzzles and your stars.

## Data and sync

Your records, wins and stars are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Billes → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
