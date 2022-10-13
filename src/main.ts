import init, { Difficulty, Sudoku } from "../pkg/sudoku";
import { getRandomIntInclusive } from "./sudoku";

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

let sudoku: Sudoku;
let memory: WebAssembly.Memory;

function drawBoard() {
  const boardPtr = sudoku.get_board();
  const givensPtr = sudoku.get_givens();
  const board = new Uint8Array(memory.buffer, boardPtr, 81);
  const givens = new Uint8Array(memory.buffer, givensPtr, 81);

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

function updateBoardFromUI() {
  for (let i = 0; i < cellInputs.length; i++) {
    sudoku.set_value(i, Number(cellInputs[i].value));
  }
}

function getDifficultyText(difficulty: Difficulty): string {
  switch (difficulty) {
    case Difficulty.Easiest:
      return "Easiest";
    case Difficulty.Easy:
      return "Easy";
    case Difficulty.Normal:
      return "Normal";
    case Difficulty.Hard:
      return "Hard";
    case Difficulty.Hardest:
      return "Hardest";
    default:
      return "";
  }
}

function initSudoku(difficulty?: Difficulty, alert = true) {
  if (alert && !confirm("Your progress will be lost. Are you sure?")) return;

  if (difficulty !== undefined) {
    sudoku.generate(difficulty);
  } else {
    sudoku.reset();
  }

  drawBoard();

  if (!currentDifficultySpan) return;

  currentDifficultySpan.textContent =
    difficulty === undefined ? "Blank" : getDifficultyText(difficulty);
}

function handleSolve() {
  if (!confirm("Your progress will be overwritten. Are you sure?")) return;

  updateBoardFromUI();

  if (!sudoku.solve()) {
    alert("Unsolvable!");
  }

  drawBoard();
}

function handleClear() {
  if (!confirm("The board will be reset. Are you sure?")) return;

  sudoku.clear();

  drawBoard();
}

function handleCheck() {
  updateBoardFromUI();

  if (sudoku.check()) {
    alert("Congratulation! You completed the puzzle!");
  } else {
    alert("The puzzle is incomplete or has conflicts");
  }
}

async function main() {
  for (let i = 0; i < cellInputs.length; i++) {
    const input = cellInputs[i];

    input.addEventListener("input", onInput);
  }

  const wasm = await init();
  memory = wasm.memory;

  sudoku = Sudoku.new();

  document.getElementById("new-blank-btn")?.addEventListener("click", () => {
    initSudoku();
  });

  document.getElementById("new-easiest-btn")?.addEventListener("click", () => {
    initSudoku(Difficulty.Easiest);
  });

  document.getElementById("new-easy-btn")?.addEventListener("click", () => {
    initSudoku(Difficulty.Easy);
  });

  document.getElementById("new-normal-btn")?.addEventListener("click", () => {
    initSudoku(Difficulty.Normal);
  });

  document.getElementById("new-hard-btn")?.addEventListener("click", () => {
    initSudoku(Difficulty.Hard);
  });

  document.getElementById("new-hardest-btn")?.addEventListener("click", () => {
    initSudoku(Difficulty.Hardest);
  });

  document.getElementById("solve-btn")?.addEventListener("click", handleSolve);
  document.getElementById("check-btn")?.addEventListener("click", handleCheck);
  document.getElementById("clear-btn")?.addEventListener("click", handleClear);

  initSudoku(
    getRandomIntInclusive(0, Object.values(Difficulty).length / 2 - 1),
    false
  );
}

main();
