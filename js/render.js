/* **********************************************/
/*                   RENDER                     */
/* **********************************************/

import { GAME_WIDTH, GAME_HEIGHT, gm_margin } from "./OBPong.js";
import { pong } from "./OBPong.js";

/** BETTER RENDER */
pong.ctx.imageSmoothingEnabled = true;
pong.ctx.imageSmoothingQuality = "high";

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

	pong.canvas.style.width = `${GAME_WIDTH * scale}px`;
	pong.canvas.style.height = `${GAME_HEIGHT * scale}px`;
	pong.canvas.style.position = 'absolute';
	pong.canvas.style.left = `${offsetX}px`;	// pos of canvas (left) -- maybe need to change these with div cnt?
	pong.canvas.style.top = `${offsetY}px`;	// position of canvas (top)

	const dpr = window.devicePixelRatio || 1;
	pong.canvas.width = GAME_WIDTH * dpr;
	pong.canvas.height = GAME_HEIGHT * dpr;

	// Escalar el contexto
	pong.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* **********************************************/
