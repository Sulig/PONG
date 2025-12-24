/* **********************************************/
/*                    PONG                      */
/* **********************************************/
import { GetJSONdata } from "./fetch.js";
import { resizeCanvas } from "./render.js";
import { pong } from "./OBPong.js";
import { checkPaddleCollision, checkWallCollision } from "./phisics.js";

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

	pong.updatePaddlePosition(pong.padL);
	pong.updatePaddlePosition(pong.padR);
});

window.addEventListener("keyup", (e) => {
	if (e.key === "ArrowUp" || e.key === "ArrowDown") {
		pong.padR.dirY = 0;
	} else if (e.key === "w" || e.key === "s") {
		pong.padL.dirY = 0;
	}

	pong.updatePaddlePosition(pong.padL);
	pong.updatePaddlePosition(pong.padR);
});

/** MOUSE INPUT */
window.addEventListener("mousemove", (e) => {
	const rect = pong.canvas.getBoundingClientRect();
	const mouseY = e.clientY - rect.top;
	pong.padL.y = mouseY - pong.padL.height / 2;
});
/*----------------- */

/** MOBILE */
window.addEventListener("touchmove", (e) => {
	const rect = pong.canvas.getBoundingClientRect();
	const touchY = e.touches[0].clientY - rect.top;
	pong.padL.y = touchY - pong.padL.height / 2;
});
/*----------------- */
/* **********************************************/

/** GAME LOOP */
function gameLoop()
{
	/** Detectar colisiones */
	checkPaddleCollision(pong.ball, pong.padL);
	checkPaddleCollision(pong.ball, pong.padR);
	checkWallCollision(pong.ball, pong.borT);
	checkWallCollision(pong.ball, pong.borB);

	// Actualizar lógica
	pong.updateBallPosition();
	pong.updatePaddlePosition(pong.padL);
	pong.updatePaddlePosition(pong.padR);

	// Redibujar
	pong.reDraw();

	// Pedir el siguiente frame
	requestAnimationFrame(gameLoop);
}

/** ON-START */
resizeCanvas();
pong.initializeGame();
requestAnimationFrame(gameLoop);
pong.decideServe();
/**----------------- */

/* **********************************************/
/*                END OF PONG                   */
/* **********************************************/
