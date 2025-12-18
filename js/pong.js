/* **********************************************/
/*                    PONG                      */
/* **********************************************/
import { GetJSONdata } from "./fetch.js";

/**-- gmscale */
const GAME_WIDTH	= 1350;
const GAME_HEIGHT	= 600;
const gm_margin			= 10;

const canvas = document.getElementById("gm-canvas");	// The game canvas
const ctx = canvas.getContext("2d");

/* ball texture */
const _tx = new Image();
_tx.src = "./assets/error-tile_TV.png";
const ball_tex = ctx.createPattern(_tx, "no-repeat");
/****/

const padW = 16, padH = 100;

/** BETTER RENDER */
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

let scale = 1;
let offsetX = 0, offsetY = 0;

function resizeCanvas()
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
	draw();
});
/**----------------- */
//*********** */

/** Utilities -- canvas <- * -> game */
function screenToGame(x, y)
{
	const rect = canvas.getBoundingClientRect();
	return {
		x: (x - rect.left) / scale,
		y: (y - rect.top) / scale
	};
}

// Función para convertir coordenadas del juego a coordenadas de pantalla
function gameToScreen(x, y)
{
	const rect = canvas.getBoundingClientRect();
	return {
		x: rect.left + x * scale,
		y: rect.top + y * scale
	};
}
/**----------------- */
//*********** */

/** GAME GRAFICS */
function draw()
{
	// Limpiar el canvas
	ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

	// Dibujar elementos del juego
	drawBorders();
	drawMidLine();

	// here i will need to comprove where's the ball bef draw it.
	startBall();
	startLPadd();
	startRPadd();
}

/** Mid line (only grafic, has no collider) */
function drawMidLine()
{
	const borderMH = 4;		// Margin Height (top - bottom)

	ctx.strokeStyle = 'white';
	ctx.lineWidth = 8;
	// -- Dash line - long, spacing
	ctx.setLineDash([30, 38]);
	ctx.beginPath();
	ctx.moveTo(GAME_WIDTH / 2, borderMH);
	ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT - borderMH);
	ctx.stroke();
}

/** Boders of Pong Game -- Will add col-. later */
function drawBorders()
{
	ctx.fillStyle = 'white';

	const borderH = 10;		// Border Height (will need this for collisions)
	const borderMH = 4;		// Margin Height (top - bottom)
	const borderMW = 25;	// Margin Width (left - right)

	// -------- Xpos, Ypos, width, height
	ctx.fillRect(borderMW, borderMH, GAME_WIDTH - (borderMW * 2), borderH);
	ctx.fillRect(borderMW, GAME_HEIGHT - (borderMH + borderH), GAME_WIDTH - (borderMW * 2), borderH);
}

/** Draw the ball --
 * Maybe i will do an start-Ball draw and update-ball
 * for set the ball direction..
 */
function startBall()
{
	// Usar coordenadas relativas al juego
	const centerX = GAME_WIDTH / 2;
	const centerY = GAME_HEIGHT / 2;
	const radius = 20;

	ctx.beginPath();
	// ---- Xpos, Ypos, width, height
	ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

	// Alternar entre textura y color sólido (para pruebas)
	try { ctx.fillStyle = ball_tex; }
	catch { ctx.fillStyle = 'white'; }

	ctx.fill();
}

/** Draw the left paddle --
 * Same as the ball --
 */
function startLPadd()
{
	ctx.fillStyle = 'white';
	const centerY = GAME_HEIGHT / 2;
	// -------- Xpos, Ypos, width, height
	ctx.fillRect(0, centerY - padH / 2, padW, padH);
}

/** Draw the left paddle --
 * Same as the ball --
 */
function startRPadd()
{
	ctx.fillStyle = 'white';
	const centerY = GAME_HEIGHT / 2;
	// -------- Xpos, Ypos, width, height
	ctx.fillRect(GAME_WIDTH - padW, centerY - padH / 2, padW, padH);
}
/**----------------- */
//*********** */

/** ON-START */
resizeCanvas();
draw();
/**----------------- */
//*********** */
