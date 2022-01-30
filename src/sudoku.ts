export enum Difficulty {
  EASIEST,
  EASY,
  NORMAL,
  HARD,
  HARDEST
}

export function getRandomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getRowIndex(cellIndex: number): number {
  return cellIndex / 9;
}

function getColIndex(cellIndex: number): number {
  return cellIndex % 9;
}

function getBlockIndex(cellIndex: number): number {
  const r = getRowIndex(cellIndex);
  const c = getColIndex(cellIndex);

  if (r >= 0 && r <= 2) {
    if (c >= 0 && c <= 2) {
      return 0;
    } else if (c >= 3 && c <= 5) {
      return 1;
    } else if (c >= 6 && c <= 8) {
      return 2;
    }
  } else if (r >= 3 && r <= 5) {
    if (c >= 0 && c <= 2) {
      return 3;
    } else if (c >= 3 && c <= 5) {
      return 4;
    } else if (c >= 6 && c <= 8) {
      return 5;
    }
  } else if (r >= 6 && r <= 8) {
    if (c >= 0 && c <= 2) {
      return 6;
    } else if (c >= 3 && c <= 5) {
      return 7;
    } else if (c >= 6 && c <= 8) {
      return 8;
    }
  }

  return -1;
}

function isConflict(
  board: number[],
  cellIndex: number,
  cellValue: number
): boolean {
  for (let i = 0; i < board.length; i++) {
    if (i == cellIndex) continue;

    const testCell = board[i];

    if (cellValue !== testCell) continue;

    if (getRowIndex(cellIndex) === getRowIndex(i)) return true;
    if (getColIndex(cellIndex) === getColIndex(i)) return true;
    if (getBlockIndex(cellIndex) === getBlockIndex(i)) return true;
  }

  return false;
}

function generateTerminalPattern(): number[] {
  const board: number[] = [];

  const test: number[][] = [];
  let c = 0;

  for (let i = 0; i < 81; i++) {
    board.push(0);

    test[i] = [];

    for (let j = 1; j <= 9; j++) {
      test[i].push(j);
    }
  }

  do {
    if (test[c].length != 0) {
      const x = getRandomIntInclusive(0, test[c].length - 1);
      const y = test[c][x];

      if (!isConflict(board, c, y)) {
        board[c] = y;
        test[c].splice(x, 1);
        c += 1;
      } else {
        test[c].splice(x, 1);
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        test[c].push(i);
      }

      c -= 1;
    }
  } while (c < 81);

  return board;
}

function getGivenCountAndMaxEmptyFromDifficulty(
  difficulty: Difficulty
): [number, number] {
  switch (difficulty) {
    case Difficulty.EASIEST:
      return [getRandomIntInclusive(50, 55), 4];
    case Difficulty.EASY:
      return [getRandomIntInclusive(36, 49), 5];
    case Difficulty.NORMAL:
      return [getRandomIntInclusive(32, 35), 6];
    case Difficulty.HARD:
      return [getRandomIntInclusive(28, 31), 7];
    case Difficulty.HARDEST:
      return [22, 9];
  }
}

export function generate(difficulty: Difficulty): number[] {
  const board = generateTerminalPattern();

  let currentGivens = 81;
  const emptyCellsInRow = [];
  const emptyCellsInColumn = [];
  const emptyCellsInBlock = [];
  const cellToDig = [];

  const [totalGivens, maxEmpty] =
    getGivenCountAndMaxEmptyFromDifficulty(difficulty);

  for (let i = 0; i < 81; i++) {
    cellToDig.push(i);
  }

  for (let i = 0; i < 9; i++) {
    emptyCellsInRow[i] = 0;
    emptyCellsInColumn[i] = 0;
    emptyCellsInBlock[i] = 0;
  }

  while (cellToDig.length > 0 && currentGivens > totalGivens) {
    const k =
      difficulty === Difficulty.HARDEST
        ? cellToDig.length - 1
        : getRandomIntInclusive(0, cellToDig.length - 1);

    const i = cellToDig[k];

    if (difficulty == Difficulty.HARDEST) {
      cellToDig.pop();
    } else {
      cellToDig.splice(k, 1);
    }

    let unique = true;

    const row = getRowIndex(i);
    const col = getColIndex(i);
    const block = getBlockIndex(i);

    if (
      emptyCellsInBlock[block] >= maxEmpty &&
      emptyCellsInColumn[col] >= maxEmpty &&
      emptyCellsInRow[row] >= maxEmpty
    ) {
      continue;
    }

    for (let j = 1; j <= 9; j++) {
      if (j == board[i]) {
        continue;
      }

      if (isConflict(board, i, j)) {
        continue;
      }

      board[i] = j;

      if (solve(board) !== false) {
        unique = false;
        break;
      }
    }

    if (unique) {
      board[i] = 0;
      emptyCellsInRow[row] += 1;
      emptyCellsInColumn[col] += 1;
      emptyCellsInBlock[block] += 1;
      currentGivens -= 1;
    }
  }

  // if (difficulty == "hardest") {
  //   let id1 = Sudoku.rand(0, 2);
  //   let id2 = Sudoku.rand(0, 2);
  //   if (id1 != id2) {
  //     board.columnBlockPropagation(id1, id2);
  //   }

  //   id1 = Sudoku.rand(0, 2);
  //   id2 = Sudoku.rand(0, 2);
  //   if (id1 != id2) {
  //     board.rowBlockPropagation(id1, id2);
  //   }
  // }

  return board;
}

export function solve(board: number[]): number[] | boolean {
  const solution: number[] = [];

  const test: number[][] = [];
  let c = 0;

  for (let i = 0; i < 81; i++) {
    solution.push(0);

    test[i] = [];
    for (let j = 1; j <= 9; j++) {
      test[i].push(j);
    }
  }

  do {
    if (board[c] > 0 || board[c] < 10) {
      solution[c] = board[c];
      c += 1;
      continue;
    }

    if (test[c].length != 0) {
      const x = test[c].length - 1;
      const y = test[c][x];

      if (!isConflict(solution, c, y)) {
        solution[c] = y;
        test[c].pop();
        c += 1;
      } else {
        test[c].pop();
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        test[c].push(i);
      }

      c -= 1;

      while (board[c]) {
        c -= 1;
      }
    }

    if (c < 0) {
      return false;
    }
  } while (c < 81);

  return solution;
}

export function check(board: number[]): boolean {
  if (board.length !== 81) return false;

  for (let i = 0; i < board.length; i++) {
    const cell = board[i];

    if (cell < 1 || cell > 9) {
      return false;
    } else {
      if (isConflict(board, i, cell)) {
        return false;
      }
    }
  }

  return true;
}
