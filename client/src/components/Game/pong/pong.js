/* **********************************************/
/*                    PONG                      */
/* **********************************************/
import { resizeCanvas } from "./render.js";
import { pong } from "./OBPong.js";
import { checkPaddleCollision, checkWallCollision } from "./phisics.js";

/********** EVENT && KEYINPUT LISTENERS *********/
// This event - Only when window is resized
window.addEventListener("resize", () => {
	resizeCanvas(pong);
	pong.reDraw();
});
/**----------------- */

/** KEYBOARD INPUT */
window.addEventListener("keydown", (e) => {
	if (e.key == pong.playerL.mov_u)
		pong.padL.dirY = -1;

	if (e.key == pong.playerL.mov_d)
		pong.padL.dirY = 1;

	if (e.key == pong.playerR.mov_u)
		pong.padR.dirY = -1;

	if (e.key == pong.playerR.mov_d)
		pong.padR.dirY = 1;

	// console.log("Key pressed: " + e.key);
});

window.addEventListener("keyup", (e) => {
	if (e.key == pong.playerL.mov_u)
		pong.padL.dirY = 0;

	if (e.key == pong.playerL.mov_d)
		pong.padL.dirY = 0;

	if (e.key == pong.playerR.mov_u)
		pong.padR.dirY = 0;

	if (e.key == pong.playerR.mov_d)
		pong.padR.dirY = 0;
});
/* **********************************************/

/** GAME LOOP */
function gameLoop()
{
	if (pong.gameOver)
		return ;

	pong.countDownServe();

	if (pong.serveNow)
	{
		/** Call to collision detection (phisics) */
		checkPaddleCollision(pong.ball, pong.padL);
		checkPaddleCollision(pong.ball, pong.padR);
		checkWallCollision(pong.ball, pong.borT);
		checkWallCollision(pong.ball, pong.borB);

		// Update positions
		pong.updateBallPosition(pong.ball);

		if (pong.padL.ai_enable)
			pong.ai.ai(pong.ball, pong.padL);
		else if (pong.set.device == "PC")
			pong.updatePaddlePosition(pong.padL);
		else
			pong.drawPaddle(pong.padL);

		if (pong.padR.ai_enable)
			pong.ai.ai(pong.ball, pong.padR);
		else if (pong.set.device == "PC")
			pong.updatePaddlePosition(pong.padR);
		else
			pong.drawPaddle(pong.padR);

		pong.checkIfBallStuck(pong.ball);
	}

	/** */
	if (pong.log_app != 1)
	{
		pong.log_app = 1;
		console.log(pong.padL);
		console.log(pong.padR);
		console.log(pong.set);
	}
	//*/

	// Redibujar
	pong.reDraw();

	// Pedir el siguiente frame
	requestAnimationFrame(gameLoop);
}

/** ON-START */
//** -- Uncomment only if React is not activated: */
//resizeCanvas(pong);
//pong.initializeGame(pongSet);
//requestAnimationFrame(gameLoop);
/**----------------- */

/** Start and Update on React */
let animationID = null;

export function startGame() {
	stopGame();
	if (animationID !== null) return ;
	function loop() {
		animationID = requestAnimationFrame(gameLoop);
	}
	loop();
}

export function stopGame() {
	if (animationID !== null) {
		cancelAnimationFrame(animationID);
		animationID = null;
	}
}

/* **********************************************/
/*                END OF PONG                   */
/* **********************************************/
