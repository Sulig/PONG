/* **********************************************/
/*                 Objects PONG                 */
/* **********************************************/

/** The canvas of the game */
export const canvas = document.getElementById("gm-canvas");	// The game canvas
export const ctx = canvas.getContext("2d");

/**-- gmscale */
export const GAME_WIDTH		= 640 * 2;
export const GAME_HEIGHT	= 480 * 2;
export const gm_margin		= 10;

/* ball texture */
export const _tx = new Image();
_tx.src = "./assets/error-tile_TV.png";
export const ball_tex = ctx.createPattern(_tx, "no-repeat");
/****/

/** OBJECTS -- */
const BALL = {
	color:	"white",
	rad:	20,
	vel:	5,
	x:		0,
	y:		0,
	dirX:	0,
	dirY:	0
};

// 	** PADDLES */
// -- width, height, velocity
const PADW = 16, PADH = 100, PADVEL = 25;
const PAD = {
	color:	"white",
	width:	PADW,
	height:	PADH,
	vel:	PADVEL,
	x:		0,
	y:		0,
	dirY:	0
};

export const BODMH = 4;	// Margin Height (top - bottom)
const BODH = 10;		// Border Height (will need this for collisions)
const BORDER = {
	color:	"white",
	width:	GAME_WIDTH,
	height:	BODH,
	x:		0,
	y:		0
};


//** PLAYER  */
export const PLAYER = {
	score: 0,
	name: "Player",
	has_last_goal: false
};

const GOAL_CORNER = {
	color:	"red",
	height:	20,
	width:	20,
	x:		0,
	y:		0,
	PLAYER: null
}
/** */
/**----------------- */

export class Pong
{
	constructor()
	{
		this.canvas = canvas;
		this.ctx = ctx;
		this.width = GAME_WIDTH;
		this.height = GAME_HEIGHT;
		this.margin = gm_margin;

		this.ball = Object.create(BALL);	// Da ball
		this.padL = Object.create(PAD);		// Left paddle
		this.padR = Object.create(PAD);		// Right paddle

		this.bodmh = BODMH;					// Border Margin Height
		this.borT = Object.create(BORDER);	// border top
		this.borB = Object.create(BORDER);	// border bottom
	}
	//*********** */

	/** GAME GRAFICS */
	/** Mid line (only grafic, has no collider) */
	drawMidLine()
	{
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 8;
		// -- Dash line - long, spacing
		ctx.setLineDash([30, 38]);
		ctx.beginPath();
		ctx.moveTo(GAME_WIDTH / 2, BODMH);
		ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT - BODMH);
		ctx.stroke();
	}

	/** Boders of Pong Game -- Will add col-. later */
	drawBorders()
	{
		ctx.fillStyle = this.borT.color;

		// -------- Xpos, Ypos, width, height
		ctx.fillRect(0, BODMH, GAME_WIDTH, BODH);
		ctx.fillRect(0, GAME_HEIGHT - (BODMH + BODH), GAME_WIDTH, BODH);
	}

	/** ON-START */
	startBall()
	{
		// Usar coordenadas relativas al juego
		const centerX = this.width / 2;
		const centerY = this.height / 2;
		const radius = this.ball.rad;

		ctx.beginPath();
		// ---- Xpos, Ypos, width, height
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = this.ball.color;
		ctx.fill();

		// Start ball coordinates
		this.ball.x = centerX;
		this.ball.y = centerY;
		console.log("Ball started at: ", this.ball.x, this.ball.y);
		console.log(this.ball);
	}

	startPaddles()
	{
		// -- * LEFT PADDLE
		ctx.fillStyle = this.padL.color;
		const centerY = this.height / 2;
		// -------- Xpos, Ypos, width, height
		this.padL.x = 0;
		this.padL.y = centerY - this.padL.height / 2;
		ctx.fillRect(0, this.padL.y, this.padL.width, this.padL.height);

		// -- * RIGHT PADDLE
		ctx.fillStyle = this.padR.color;
		// -------- Xpos, Ypos, width, height
		this.padR.x = this.width - this.padR.width;
		this.padR.y = centerY - this.padR.height / 2;
		ctx.fillRect(this.padR.x, this.padR.y, this.padR.width, this.padR.height);

	}
	/**----------------- */

	initializeGame()
	{
		this.drawBorders();
		this.drawMidLine();
		this.startBall();
		this.startPaddles();
	}

	/**--- */
	drawPaddle(paddle)
	{
		ctx.fillStyle = paddle.color;
		ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
	}

	drawBall(ball)
	{
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.rad, 0, 2 * Math.PI, false);
		ctx.fillStyle = ball.color;
		ctx.fill();
	}
	/**--- */

	/** Redraw the entire game screen */
	reDraw()
	{
		// Clear the canvas
		ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

		// Draw borders and mid line
		this.drawBorders();
		this.drawMidLine();

		// Draw paddles and ball
		this.drawBall(this.ball);
		this.drawPaddle(this.padL);
		this.drawPaddle(this.padR);
	}
	//*********** */


	/** MOVEMENT */
	updatePaddlePosition(paddle)
	{
		paddle.y += paddle.dirY * paddle.vel;
		// Ensure paddle stays within game bounds
		if (paddle.y < this.bodmh) {
			paddle.y = this.bodmh;
		} else if (paddle.y + paddle.height > this.height - this.bodmh) {
			paddle.y = this.height - this.bodmh - paddle.height;
		}
		this.reDraw();
		console.log(paddle);
	}
	/**----------------- */
}

export let pong = new Pong();
