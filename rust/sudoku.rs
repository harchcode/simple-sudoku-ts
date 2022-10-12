use std::array::from_fn;
use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// pub fn generate(difficulty: Difficulty) -> *const u8 {
//     let mut givens: [u8; 81] = [0; 81];
//     let mut solutions: [u8; 81] = [0; 81];
//     let mut rng = rand::thread_rng();

//     generate_terminal_pattern(&mut givens);

//     let mut current_givens = 81;
//     let mut empty_cells_in_row: [u8; 9] = [0; 9];
//     let mut empty_cells_in_column: [u8; 9] = [0; 9];
//     let mut empty_cells_in_block: [u8; 9] = [0; 9];
//     let mut cell_to_dig = from_fn(|i| i);
//     let mut s = 81;

//     let (total_givens, max_empty) = get_given_count_and_max_empty_from_difficulty(difficulty);

//     while s > 0 && current_givens > total_givens {
//         let k = match difficulty {
//             Difficulty::Hardest => s - 1,
//             _ => rng.gen_range(0, s),
//         };

//         let i = cell_to_dig[k];

//         if difficulty == Difficulty::Hardest {
//             s -= 1;
//             shift81(&mut cell_to_dig, s);
//         } else {
//             s -= 1;
//             shift81(&mut cell_to_dig, k);
//         }

//         let tmp = givens[i];
//         let mut unique = true;
//         let row = get_row_index(i);
//         let col = get_col_index(i);
//         let block = get_block_index(i);

//         if empty_cells_in_block[block] >= max_empty
//             && empty_cells_in_column[col] >= max_empty
//             && empty_cells_in_row[row] >= max_empty
//         {
//             continue;
//         }

//         for j in 1..10 {
//             if j == tmp {
//                 continue;
//             }

//             if is_conflict(&givens, i, j) {
//                 continue;
//             }

//             givens[i] = j;

//             if solvepv(&givens, &mut solutions) {
//                 unique = false;
//                 break;
//             }
//         }

//         if unique {
//             givens[i] = 0;
//             empty_cells_in_row[row] += 1;
//             empty_cells_in_column[col] += 1;
//             empty_cells_in_block[block] += 1;
//             current_givens -= 1;
//         } else {
//             givens[i] = tmp;
//         }
//     }

//     if difficulty == Difficulty::Hardest {
//         let range = Range::new(0, 3);

//         let id1 = range.ind_sample(&mut rng);
//         let id2 = range.ind_sample(&mut rng);

//         if id1 != id2 {
//             col_block_propagation(&mut givens, id1, id2)
//         }

//         let id1 = range.ind_sample(&mut rng);
//         let id2 = range.ind_sample(&mut rng);

//         if id1 != id2 {
//             row_block_propagation(&mut givens, id1, id2)
//         }
//     }

//     return givens.as_ptr();
// }

// #[wasm_bindgen]
// pub unsafe fn check(pboard: *const u8) -> bool {
//     let board: &[u8; 81] = &from_fn(|i| *(pboard.add(i)));

//     for i in 0..81 {
//         let cell = board[i];

//         if cell < 1 || cell > 9 {
//             return false;
//         } else if is_conflict(board, i, cell) {
//             return false;
//         }
//     }

//     return true;
// }

// #[wasm_bindgen]
// pub unsafe fn check_conflict(pboard: *const u8) -> bool {
//     let board: &[u8; 81] = &from_fn(|i| *(pboard.add(i)));

//     for i in 0..81 {
//         let cell = board[i];

//         if cell < 1 || cell > 9 {
//             continue;
//         } else if is_conflict(board, i, cell) {
//             return true;
//         }
//     }

//     return false;
// }

// #[wasm_bindgen]
// pub unsafe fn solve(pboard: *const u8) -> *const u8 {
//     let board: &[u8; 81] = &from_fn(|i| *(pboard.add(i)));
//     let mut solution: [u8; 81] = [0; 81];

//     let is_solved = solvepv(board, &mut solution);

//     if is_solved {
//         return solution.as_ptr();
//     } else {
//         return [0; 81].as_ptr();
//     }
// }
