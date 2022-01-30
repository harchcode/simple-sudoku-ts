const sudokuTable = document.getElementsByClassName(
  "sudoku-board"
)[0] as HTMLTableElement;

const cellInputs = sudokuTable.getElementsByTagName("input");

function onInputKeyDown(e: KeyboardEvent) {
  const { key } = e;

  const input = e.target as HTMLInputElement;

  if (key === "Backspace" || key === "Delete" || key === " ") {
    e.preventDefault();
    input.value = "";
    return;
  }

  const num = Number(key);

  if (isNaN(num) || num <= 0) {
    e.preventDefault();
    return;
  }

  if (num > 0 && num < 10) {
    e.preventDefault();
    input.value = key;
  }
}

for (let i = 0; i < cellInputs.length; i++) {
  const input = cellInputs[i];

  input.addEventListener("keydown", onInputKeyDown);
}
