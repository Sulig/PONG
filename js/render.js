/* **********************************************/
/*                   RENDER                     */
/* **********************************************/

import { canvas, ctx, GAME_WIDTH, GAME_HEIGHT, gm_margin } from "./OBPong.js";
import { pong } from "./OBPong.js";

/** BETTER RENDER */
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

let scale = 1;
let offsetX = 0, offsetY = 0;

export function resizeCanvas()
{
	const winWidth = window.innerWidth;
	const winHeight = window.innerHeight;

	// Usa todo el espacio disponible (menos un pequeño margen opcional)
	const availableWidth = winWidth - (gm_margin * 2);
	const availableHeight = winHeight - (gm_margin * 2);

	scale = Math.min(availableWidth / GAME_WIDTH, availableHeight / GAME_HEIGHT);

	offsetX = (winWidth - GAME_WIDTH * scale) / 2;
	offsetY = (winHeight - GAME_HEIGHT * scale) / 2;

	canvas.style.width = `${GAME_WIDTH * scale}px`;
	canvas.style.height = `${GAME_HEIGHT * scale}px`;
	canvas.style.position = 'absolute';
	canvas.style.left = `${offsetX}px`;	// pos of canvas (left) -- maybe need to change these with div cnt?
	canvas.style.top = `${offsetY}px`;	// position of canvas (top)

	const dpr = window.devicePixelRatio || 1;
	canvas.width = GAME_WIDTH * dpr;
	canvas.height = GAME_HEIGHT * dpr;

	// Escalar el contexto
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// Event listeners - Only when window is resized
window.addEventListener("resize", () => {
	resizeCanvas();
	pong.reDraw();
});
/**----------------- */


/* **********************************************/
