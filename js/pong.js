/* **********************************************/
/*                    PONG                      */
/* **********************************************/
import "./fetch.js";
import { resizeCanvas } from "./render.js";
import { pongSet } from "./settings.js";
import { pong } from "./OBPong.js";
import { checkPaddleCollision, checkWallCollision } from "./phisics.js";

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
window.addEventListener("wheel", (e) => {
	e.preventDefault();

	const speed = 0.75;
	const delta = e.deltaY * speed;
	console.log("Delta: ", delta);

	if (pong.padL.controller == "mouse")
	{
		pong.padL.y += delta;
		if (pong.padL.y < 0) {
			pong.padL.y = 0;
		} else if (pong.padL.y + pong.padL.height > pong.height) {
			pong.padL.y = pong.height - pong.padL.height;
		}
	}
	else if (pong.padR.controller == "mouse")
	{
		pong.padR.y += delta;
		if (pong.padR.y < 0) {
			pong.padR.y = 0;
		} else if (pong.padR.y + pong.padR.height > pong.height) {
			pong.padR.y = pong.height - pong.padR.height;
		}
	}
});
/**/
/*----------------- */

/** MOBILE */
const deviceM = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isTouchable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (deviceM || isTouchable)
{
	pongSet.device = "Mobile";
	pong.setSliders(pongSet);
}

pong.sliderL.addEventListener("input", (e) => {
	const s = e.target;
	const normalized = s.value / s.max;
	pong.padL.y = normalized * (pong.height - pong.padL.height);
});

pong.sliderR.addEventListener("input", (e) => {
	const s = e.target;
	const normalized = s.value / s.max;
	pong.padR.y = normalized * (pong.height - pong.padR.height);
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

	/*
	if (pong.log_app != 1)
	{
		pong.log_app = 1;
		console.log(pong.padL);
		console.log(pong.padR);
		console.log(pong.set);
	}
	*/

	// Redibujar
	pong.reDraw();

	// Pedir el siguiente frame
	requestAnimationFrame(gameLoop);
}

/** ON-START */
resizeCanvas();
pong.initializeGame(pongSet);
requestAnimationFrame(gameLoop);
/**----------------- */

/* **********************************************/
/*                END OF PONG                   */
/* **********************************************/
