/* **********************************************/
/*                    PONG                      */
/* **********************************************/
import { GetJSONdata } from "./fetch.js";

const canvas = document.getElementById("gm-canvas");
const ctx = canvas.getContext("2d");

/* better render */
const dpr = window.devicePixelRatio || 1;
const cn_rect = canvas.getBoundingClientRect();

//canvas.width = cn_rect.width * dpr;		// 2420
//canvas.height = cn_rect.height * dpr;	// 1120

ctx.scale(dpr, dpr);
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";
//*********** */

/* ball texture */
const _tx = new Image();
_tx.src = "./src/assets/error-tile_TV.png";
const ball_tex = ctx.createPattern(_tx, "no-repeat");

drawBall();
drawBorder();

function drawBall(/* here the popsitions of the ball or the ball in se?*/)
{
	ctx.beginPath();
	// --- Xpos,                Ypos,       , rad,   remove angle     ,portion (2 * Math.PI => this is all circumference)
	ctx.arc(screen.width / 2, canvas.height / 2, 20, 0, 2 * Math.PI, false);
	ctx.fillStyle = ball_tex;
	ctx.fillStyle = 'white';
	ctx.fill();
}

function drawBorder()
{
	ctx.fillStyle = 'white';
	// -------- Xpos, Ypos, width, height
	ctx.fillRect(30, 4, canvas.width - 600, 10);
}
