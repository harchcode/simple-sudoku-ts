import init, { greet } from "../pkg/sudoku_crate";
import {
  check,
  checkConflict,
  Difficulty,
  generate,
  getRandomIntInclusive,
  solve
} from "./sudoku";

const sudokuTable = document.getElementById("sudoku-board") as HTMLTableElement;
const cellInputs = sudokuTable.getElementsByTagName("input");
const currentDifficultySpan = document.getElementById(
  "current-difficulty-span"
);

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;

  if (!target) return;

  const v = target.value[target.value.length - 1];

  if (v >= "0" && v <= "9") {
    target.value = v;
  } else {
    target.value = "";
  }
}

for (let i = 0; i < cellInputs.length; i++) {
  const input = cellInputs[i];

  input.addEventListener("input", onInput);
}

function drawBoard(board: number[], givens: number[]) {
  for (let i = 0; i < 81; i++) {
    const input = cellInputs[i];
    const cell = board[i];
    const given = givens[i];

    if (given && given > 0 && given < 10) {
      input.value = given.toString();
      input.disabled = true;
    } else {
      input.value = cell && cell > 0 && cell < 10 ? cell.toString() : "";
      input.disabled = false;
    }
  }
}

let currentGivens: number[] = [];

function getDifficultyText(difficulty: Difficulty): string {
  switch (difficulty) {
    case Difficulty.EASIEST:
      return "Easiest";
    case Difficulty.EASY:
      return "Easy";
    case Difficulty.NORMAL:
      return "Normal";
    case Difficulty.HARD:
      return "Hard";
    case Difficulty.HARDEST:
      return "Hardest";
  }
}

function initSudoku(difficulty?: Difficulty, alert = true) {
  if (alert && !confirm("Your progress will be lost. Are you sure?")) return;

  currentGivens = difficulty !== undefined ? generate(difficulty) : [];

  drawBoard([], currentGivens);

  if (!currentDifficultySpan) return;

  currentDifficultySpan.textContent =
    difficulty === undefined ? "Blank" : getDifficultyText(difficulty);
}

function getBoard(): number[] {
  const board: number[] = [];

  for (let i = 0; i < cellInputs.length; i++) {
    board.push(Number(cellInputs[i].value));
  }
  return board;
}

document.getElementById("new-blank-btn")?.addEventListener("click", () => {
  initSudoku();
});

document.getElementById("new-easiest-btn")?.addEventListener("click", () => {
  initSudoku(Difficulty.EASIEST);
});

document.getElementById("new-easy-btn")?.addEventListener("click", () => {
  initSudoku(Difficulty.EASY);
});

document.getElementById("new-normal-btn")?.addEventListener("click", () => {
  initSudoku(Difficulty.NORMAL);
});

document.getElementById("new-hard-btn")?.addEventListener("click", () => {
  initSudoku(Difficulty.HARD);
});

document.getElementById("new-hardest-btn")?.addEventListener("click", () => {
  initSudoku(Difficulty.HARDEST);
});

document.getElementById("solve-btn")?.addEventListener("click", () => {
  if (!confirm("Your progress will be overwritten. Are you sure?")) return;

  if (currentGivens.length > 0) {
    const board = solve(currentGivens);

    if (board) drawBoard(board, currentGivens);
    else alert("Unsolvable!!");
  } else {
    const givens = getBoard();

    if (checkConflict(givens)) {
      alert("Unsolvable!!");
      return;
    }

    const board = solve(givens);

    if (board) {
      currentGivens = givens;
      drawBoard(board, currentGivens);
    } else alert("Unsolvable!!");
  }
});

document.getElementById("clear-btn")?.addEventListener("click", () => {
  if (!confirm("The board will be reset. Are you sure?")) return;

  drawBoard([], currentGivens);
});

document.getElementById("check-btn")?.addEventListener("click", () => {
  if (check(getBoard())) {
    alert("Congratulation! You completed the puzzle!");
  } else {
    alert("The puzzle is incomplete or has conflicts");
  }
});

initSudoku(
  getRandomIntInclusive(0, Object.values(Difficulty).length / 2 - 1),
  false
);

async function abc() {
  await init();
  greet("hohooho");
}

abc();
