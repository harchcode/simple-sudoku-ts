import init, { Difficulty, Sudoku } from "../pkg/sudoku";
import wasmUrl from "../pkg/sudoku_bg.wasm?url";
import { getRandomIntInclusive } from "./sudoku";

const sudokuTable = document.getElementById("sudoku-board") as HTMLTableElement;
const cellInputs = sudokuTable.getElementsByTagName("input");
const currentDifficultySpan = document.getElementById(
  "current-difficulty-span"
);

let currentBoard: Sudoku;
let memory: WebAssembly.Memory;

function drawBoard() {
  const boardPtr = currentBoard.get_board();
  const givensPtr = currentBoard.get_givens();
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
    currentBoard.generate(difficulty);
  } else {
    currentBoard.reset();
  }

  drawBoard();

  if (!currentDifficultySpan) return;

  currentDifficultySpan.textContent =
    difficulty === undefined ? "Blank" : getDifficultyText(difficulty);
}

async function main() {
  const wasm = await init(wasmUrl);
  memory = wasm.memory;

  currentBoard = Sudoku.new();

  initSudoku(
    getRandomIntInclusive(0, Object.values(Difficulty).length / 2 - 1),
    false
  );
}

main();
