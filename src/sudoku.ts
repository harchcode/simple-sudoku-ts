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
  return Math.floor(cellIndex / 9);
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

    if (testCell === 0 || isNaN(testCell)) continue;
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

      board[c] = 0;
    }
  } while (c < 81);

  return board;
}

function colBlockPropagation(board: number[], index1: number, index2: number) {
  let id1 = index1 * 3;
  let id2 = index2 * 3;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 3; j++) {
      const tmp = board[id1];
      board[id1] = board[id2];
      board[id2] = tmp;

      id1++;
      id2++;
    }
    id1 += 6;
    id2 += 6;
  }
}

function rowBlockPropagation(board: number[], index1: number, index2: number) {
  let id1 = index1 * 27;
  let id2 = index2 * 27;

  for (let i = 0; i < 27; i++) {
    const tmp = board[id1];
    board[id1] = board[id2];
    board[id2] = tmp;

    id1++;
    id2++;
  }
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
  const givens = generateTerminalPattern();

  let currentGivens = 81;
  const emptyCellsInRow: number[] = [];
  const emptyCellsInColumn: number[] = [];
  const emptyCellsInBlock: number[] = [];
  const cellToDig: number[] = [];

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

    const tmp = givens[i];
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
      if (j === tmp) {
        continue;
      }

      if (isConflict(givens, i, j)) {
        continue;
      }

      givens[i] = j;

      if (solve(givens)) {
        unique = false;
        break;
      }
    }

    if (unique) {
      givens[i] = 0;
      emptyCellsInRow[row] += 1;
      emptyCellsInColumn[col] += 1;
      emptyCellsInBlock[block] += 1;
      currentGivens -= 1;
    } else {
      givens[i] = tmp;
    }
  }

  if (difficulty == Difficulty.HARDEST) {
    let id1 = getRandomIntInclusive(0, 2);
    let id2 = getRandomIntInclusive(0, 2);
    if (id1 != id2) {
      colBlockPropagation(givens, id1, id2);
    }

    id1 = getRandomIntInclusive(0, 2);
    id2 = getRandomIntInclusive(0, 2);
    if (id1 != id2) {
      rowBlockPropagation(givens, id1, id2);
    }
  }

  return givens;
}

export function solve(givens: number[]): number[] | false {
  const solution = [];

  const test: number[][] = [];
  let c = 0;

  for (let i = 0; i < 81; i++) {
    solution.push(givens[i] || 0);

    test[i] = [];
    for (let j = 1; j <= 9; j++) {
      test[i].push(j);
    }
  }

  do {
    if (givens[c] && givens[c] > 0 && givens[c] < 10) {
      c += 1;
      continue;
    }

    if (test[c].length !== 0) {
      const y = test[c].pop() || 0;

      if (!isConflict(solution, c, y)) {
        solution[c] = y;
        c += 1;
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        test[c].push(i);
      }

      c -= 1;

      while (givens[c] && givens[c] > 0 && givens[c] < 10) {
        c -= 1;
      }

      solution[c] = 0;
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

export function checkConflict(board: number[]): boolean {
  for (let i = 0; i < 81; i++) {
    const cell = board[i];

    if (!cell || cell < 1 || cell > 9) {
      continue;
    } else {
      if (isConflict(board, i, cell)) {
        return true;
      }
    }
  }

  return false;
}
