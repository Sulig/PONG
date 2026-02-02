/* **********************************************/
/*                    PONG                      */
/* **********************************************/
import "./fetch.js";
import { resizeCanvas } from "./render.js";
import { pong } from "./OBPong.js";
import { checkPaddleCollision, checkWallCollision } from "./phisics.js";
import { ai } from "./AI.js"

/********** EVENT && KEYINPUT LISTENERS *********/
// Event listeners - Only when window is resized
window.addEventListener("resize", () => {
	resizeCanvas();
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

/** MOUSE INPUT */
// Change to scroll? (look for - wheel -)
/*
window.addEventListener("mousemove", (e) => {
	const rect = pong.canvas.getBoundingClientRect();
	const mouseY = e.clientY - rect.top;
	pong.padL.y = mouseY - pong.padL.height / 2;
});
*/
/*----------------- */

/** MOBILE */
// -- Tal vez utilizar la inclinacion? o incluir un slider
// Deberia hacer el disenyo en vertical para movil??
window.addEventListener("touchmove", (e) => {
	const rect = pong.canvas.getBoundingClientRect();
	const touchY = e.touches[0].clientY - rect.top;

	// Realmente tendria que mover la pala asignada, pero eso ya lo configurare mas tarde
	pong.padL.y = touchY - pong.padL.height / 2;
});
/*----------------- */
/* **********************************************/

/** GAME LOOP */
function gameLoop()
{
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
			ai.ai(pong.ball, pong.padL); // yes, you can set the other paddle as ai too.
		else
			pong.updatePaddlePosition(pong.padL);

		if (pong.padR.ai_enable)
			ai.ai(pong.ball, pong.padR);
		else
			pong.updatePaddlePosition(pong.padR);

		pong.checkIfBallStuck(pong.ball);
	}

	if (pong.log_app != 1)
	{
		pong.log_app = 1;
		console.log(pong.padL);
		console.log(pong.padR);
	}

	// Redibujar
	pong.reDraw();

	// Pedir el siguiente frame
	requestAnimationFrame(gameLoop);
}

/** ON-START */
resizeCanvas();
pong.initializeGame();
ai.setLevel(pong.ball, pong.padR, "hard"); // "easy", "mid", "hard"
//ai.setLevel(pong.ball, pong.padL, "hard"); // Funny

requestAnimationFrame(gameLoop);
/**----------------- */

/* **********************************************/
/*                END OF PONG                   */
/* **********************************************/
