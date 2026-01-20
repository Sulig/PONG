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
	if (e.key === "ArrowUp") {
		pong.padR.dirY = -1;
	} else if (e.key === "ArrowDown") {
		pong.padR.dirY = 1;
	}

	if (e.key === "w") {
		pong.padL.dirY = -1;
	} else if (e.key === "s") {
		pong.padL.dirY = 1;
	}

	pong.movePaddle(pong.padL, pong.padL.dirY);
	//pong.movePaddle(pong.padR, pong.padR.dirY);

	console.log("Key pressed: " + e.key);
});

window.addEventListener("keyup", (e) => {
	if (e.key === "ArrowUp" || e.key === "ArrowDown") {
		pong.padR.dirY = 0;
	} else if (e.key === "w" || e.key === "s") {
		pong.padL.dirY = 0;
	}

	pong.movePaddle(pong.padL, pong.padL.dirY);
	//pong.movePaddle(pong.padR, pong.padR.dirY);
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
	/** Call to collision detection (phisics) */
	checkPaddleCollision(pong.ball, pong.padL);
	checkPaddleCollision(pong.ball, pong.padR);
	checkWallCollision(pong.ball, pong.borT);
	checkWallCollision(pong.ball, pong.borB);

	// Update positions
	pong.updateBallPosition(pong.ball);

	pong.updatePaddlePosition(pong.padL);
	//pong.updatePaddlePosition(pong.padR);

	ai.ai(pong.ball, pong.padR);

	// Redibujar
	pong.reDraw();

	// Pedir el siguiente frame
	requestAnimationFrame(gameLoop);
}

/** ON-START */
resizeCanvas();
pong.initializeGame();
requestAnimationFrame(gameLoop);
/**----------------- */

/* **********************************************/
/*                END OF PONG                   */
/* **********************************************/
