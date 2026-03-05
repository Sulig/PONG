/* **********************************************/
/*                   RENDER                     */
/* **********************************************/

import { GAME_WIDTH, GAME_HEIGHT, gm_margin } from "./OBPong.js";

/** BETTER RENDER */
let scale = 1;
let offsetX = 0, offsetY = 0;

export function resizeCanvas(pong)
{
	if (pong.canvas == null)
		return ;

	const container = pong.canvas.parentElement;
	if (!container) return;

	const availableWidth = container.clientWidth;
	const availableHeight = container.clientHeight;

	scale = Math.min(availableWidth / GAME_WIDTH, availableHeight / GAME_HEIGHT);

	pong.canvas.style.width = `${GAME_WIDTH * scale}px`;
	pong.canvas.style.height = `${GAME_HEIGHT * scale}px`;

	const dpr = window.devicePixelRatio || 1;
	pong.canvas.width = GAME_WIDTH * dpr;
	pong.canvas.height = GAME_HEIGHT * dpr;
	pong.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* **********************************************/
