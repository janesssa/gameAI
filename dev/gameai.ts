/// <reference path="knight.ts" />
/// <reference path="tile.ts" />

class GameAI {
    public static DEPTH: number = 7
    public static bestMove: [number, number]
    public static bestKnight: number
    
    public static minmax (depth: number, maximizingPlayer: boolean, gameState: GameState, king: King, knights: Knight[]) {
        // If the game is over (win/lose) or if the depth is 0 return the score
        if(gameState.getScore()[1] || depth === 0){
            return gameState.getScore()[0]
        } else {
            if(maximizingPlayer){
                let max = -Infinity
                // Loop through all players to get the highest number 
                knights.forEach((knight, player) => {
                    let legalMoves = knight.getMoves(gameState.knightPositions[player])
                    for(let i = 0; i < legalMoves.length; i++){
                        let newState = gameState.copy()
                        newState.knightPositions[player] = legalMoves[i]
                        let value = this.minmax(depth - 1, false, newState, king, knights)
                        // When you are at the top level you need to save the move and player 
                        if(depth === this.DEPTH && value > max){
                            this.bestMove = newState.knightPositions[player]
                            this.bestKnight = player
                        }
                        // Always update the max, even if your not in the top level
                        max = Math.max(max, value)
                    }
                })

                return max
            } else {
                let legalMoves = king.getMoves(gameState.kingPos)   
                let min = Infinity
                for(let i = 0; i < legalMoves.length; i++){
                    let newState = gameState.copy()
                    newState.kingPos = legalMoves[i]
                    let value = this.minmax(depth - 1, true, newState, king, knights)
                    min = Math.min(min, value)
                }
                return min
            }
        }
    }

    public static moveKnight(king:King, knights:Knight[], gameState:GameState) {
        let t0 = performance.now();

        // Call the minimax function to start the AI
        this.minmax(this.DEPTH, true, gameState, king, knights)

        knights[this.bestKnight].setPosition(this.bestMove)
        gameState.knightPositions[this.bestKnight] = this.bestMove

        let t1 = performance.now();
        console.log("AI move took " + (t1 - t0) + " milliseconds.");

    }


}