/* **********************************************/
/*                    PONG                      */
/* **********************************************/
import { GetJSONdata } from "./fetch.js";
import { resizeCanvas } from "./render.js";
import { pong } from "./OBPong.js";

/** ON-START */
resizeCanvas();
pong.initializeGame();
/**----------------- */
//*********** */

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
