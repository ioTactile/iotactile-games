// private generateBoard(boardSize: BoardSize): void {
//   this.board = Array.from({ length: boardSize }, () =>
//     Array.from({ length: boardSize }, () => new Cell())
//   )

//   this.bruteSolve(boardSize)
//   this.setStarters(boardSize)
// }

// private possible(row: number, col: number, state: Value): boolean {
//   this.board[row][col].setValue(state)

//   let rowSumBlack = 0
//   let rowSumBlackCon = 0

//   let rowSumWhite = 0
//   let rowSumWhiteCon = 0

//   let columnSumBlack = 0
//   let columnSumBlackCon = 0

//   let columnSumWhite = 0
//   let columnSumWhiteCon = 0

//   for (let i = 0; i < this.boardSize; i++) {
//     if (this.board[row][i].getValue() === 'black') {
//       rowSumBlack++
//       rowSumBlackCon++
//       if (rowSumBlackCon === 3) {
//         this.board[row][col].setValue('empty')
//         return false
//       }
//     } else {
//       rowSumBlackCon = 0
//     }

//     if (this.board[row][i].getValue() === 'white') {
//       rowSumWhite++
//       rowSumWhiteCon++
//       if (rowSumWhiteCon === 3) {
//         this.board[row][col].setValue('empty')
//         return false
//       }
//     } else {
//       rowSumWhiteCon = 0
//     }

//     if (this.board[i][col].getValue() === 'black') {
//       columnSumBlack++
//       columnSumBlackCon++
//       if (columnSumBlackCon === 3) {
//         this.board[row][col].setValue('empty')
//         return false
//       }
//     } else {
//       columnSumBlackCon = 0
//     }

//     if (this.board[i][col].getValue() === 'white') {
//       columnSumWhite++
//       columnSumWhiteCon++
//       if (columnSumWhiteCon === 3) {
//         this.board[row][col].setValue('empty')
//         return false
//       }
//     } else {
//       columnSumWhiteCon = 0
//     }
//   }

//   this.board[row][col].setValue('empty')

//   if (rowSumBlack > this.boardSize / 2) {
//     return false
//   }
//   if (rowSumWhite > this.boardSize / 2) {
//     return false
//   }
//   if (columnSumBlack > this.boardSize / 2) {
//     return false
//   }
//   if (columnSumWhite > this.boardSize / 2) {
//     return false
//   }
//   return true
// }

// private bruteSolve(boardSize: BoardSize): void {
//   for (let row = 0; row < boardSize; row++) {
//     for (let col = 0; col < boardSize; col++) {
//       if (this.board[row][col].getValue() === 'empty') {
//         const state = ['black', 'white'] as Value[]
//         state.forEach((s) => {
//           if (this.possible(row, col, s)) {
//             this.board[row][col].setValue(s)
//             this.bruteSolve(boardSize)
//             this.board[row][col].setValue('empty')
//           }
//         })
//         return
//       }
//     }
//   }
// }

// private smartSolve(boardSize: BoardSize): void {
//   for (let row = 0; row < boardSize; row++) {
//     for (let col = 0; col < boardSize; col++) {
//       // Check if two horizontal tiles are the same
//       if (row > 0) {
//         if (
//           this.board[row][col] === this.board[row][col - 1] &&
//           this.board[row][col].getValue() !== 'empty'
//         ) {
//           if (col < boardSize - 1) {
//             this.board[row][col + 1].setValue(
//               this.board[row][col].getValue() === 'black' ? 'white' : 'black'
//             )
//           }
//           if (col > 1) {
//             this.board[row][col - 2].setValue(
//               this.board[row][col].getValue() === 'black' ? 'white' : 'black'
//             )
//           }
//         }
//       }

//       // Check if two vertical tiles are the same
//       if (row > 0) {
//         if (
//           this.board[row][col] === this.board[row - 1][col] &&
//           this.board[row][col].getValue() !== 'empty'
//         ) {
//           if (row < boardSize - 1) {
//             this.board[row + 1][col].setValue(
//               this.board[row][col].getValue() === 'black' ? 'white' : 'black'
//             )
//           }
//           if (row > 1) {
//             this.board[row - 2][col].setValue(
//               this.board[row][col].getValue() === 'black' ? 'white' : 'black'
//             )
//           }
//         }
//       }

//       // Check if tile is between two of the same color horizontally
//       if (col > 0 && col < boardSize - 1) {
//         if (
//           this.board[row][col - 1] === this.board[row][col + 1] &&
//           this.board[row][col - 1].getValue() !== 'empty'
//         ) {
//           this.board[row][col].setValue(
//             this.board[row][col - 1].getValue() === 'black'
//               ? 'white'
//               : 'black'
//           )
//         }
//       }

//       // Check if tile is between two of the same color vertically
//       if (row > 0 && row < boardSize - 1) {
//         if (
//           this.board[row - 1][col] === this.board[row + 1][col] &&
//           this.board[row - 1][col].getValue() !== 'empty'
//         ) {
//           this.board[row][col].setValue(
//             this.board[row - 1][col].getValue() === 'black'
//               ? 'white'
//               : 'black'
//           )
//         }
//       }
//     }
//   }

//   // Check the total number of black and white tiles in each row and column
//   for (let i = 0; i < boardSize; i++) {
//     let rowSumBlack = 0
//     let rowSumWhite = 0

//     let columnSumBlack = 0
//     let columnSumWhite = 0

//     for (let n = 0; n < boardSize; n++) {
//       // Check rows
//       if (this.board[i][n].getValue() === 'black') {
//         rowSumBlack++
//       } else if (this.board[i][n].getValue() === 'white') {
//         rowSumWhite++
//       }

//       // Check columns
//       if (this.board[n][i].getValue() === 'black') {
//         columnSumBlack++
//       } else if (this.board[n][i].getValue() === 'white') {
//         columnSumWhite++
//       }
//     }

//     if (rowSumBlack === boardSize / 2) {
//       for (let j = 0; j < boardSize; j++) {
//         if (this.board[i][j].getValue() === 'empty') {
//           this.board[i][j].setValue('white')
//         }
//       }
//     } else if (rowSumWhite === boardSize / 2) {
//       for (let j = 0; j < boardSize; j++) {
//         if (this.board[i][j].getValue() === 'empty') {
//           this.board[i][j].setValue('black')
//         }
//       }
//     }

//     if (columnSumBlack === boardSize / 2) {
//       for (let j = 0; j < boardSize; j++) {
//         if (this.board[j][i].getValue() === 'empty') {
//           this.board[j][i].setValue('white')
//         }
//       }
//     } else if (columnSumWhite === boardSize / 2) {
//       for (let j = 0; j < boardSize; j++) {
//         if (this.board[j][i].getValue() === 'empty') {
//           this.board[j][i].setValue('black')
//         }
//       }
//     }
//   }
// }

// private setStarters(boardSize: BoardSize): void {
//   let numStarters = 0
//   switch (boardSize) {
//     case 4:
//       numStarters = 5
//       break
//     case 6:
//       numStarters = 10
//       break
//     case 8:
//       numStarters = 18
//       break
//     case 10:
//       numStarters = 22
//       break
//     case 12:
//       numStarters = 30
//       break
//     case 14:
//       numStarters = 50
//       break
//     case 16:
//       numStarters = 70
//       break
//     case 18:
//       numStarters = 90
//       break
//     case 20:
//       numStarters = 110
//       break
//   }

//   let starters = 0

//   while (starters < numStarters) {
//     const row = Math.floor(Math.random() * boardSize)
//     const col = Math.floor(Math.random() * boardSize)
//     const cell = this.board[row][col]

//     if (cell.getIsStarter()) {
//       continue
//     }

//     cell.setValue(cell.getValue())
//     cell.setIsStarter(true)
//     starters++
//   }
// }

// private revealStarters(): void {
//   for (let row = 0; row < this.boardSize; row++) {
//     for (let col = 0; col < this.boardSize; col++) {
//       const cell = this.board[row][col]
//       if (cell.getIsStarter()) {
//         cell.setValue(cell.getValue())
//       }
//     }
//   }
// }
