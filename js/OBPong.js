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
const WAIT_TIME = 2000; // Time to wait before serve (ms)

// 	** BALL */
const BALL_VEL = 12;	// Ball velocity
const BALL = {
	color:	"white",
	rad:	20,
	vel:	BALL_VEL,
	x:		0,
	y:		0,
	dirX:	0,
	dirY:	0
};

// 	** PADDLES */
// -- width, height, velocity
const PADW = 16, PADH = 100, PADVEL = 18;
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

//** GOAL CORNER */
const GOAL_CORNER = {
	color:	"yellow",
	height:	GAME_HEIGHT,
	width:	6,
	x:		0,
	y:		0,
};

//** PLAYER  */
export const MAX_SCORE = 3;
export const PLAYER = {
	is_ai: false,
	name: "Player",
	score: 0,
	serve:  false,
	my_pad: null,
	corner: null,
};
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

		this.bodmh = BODMH;						// Border Margin Height
		this.borT = Object.create(BORDER);		// border top
		this.borB = Object.create(BORDER);		// border bottom

		this.corL = Object.create(GOAL_CORNER);	// Left Goal Corner
		this.corR = Object.create(GOAL_CORNER);	// Right Goal Corner

		this.ball = Object.create(BALL);		// Da ball
		this.padL = Object.create(PAD);			// Left paddle
		this.padR = Object.create(PAD);			// Right paddle

		this.playerL = Object.create(PLAYER);	// Left player
		this.playerR = Object.create(PLAYER);	// Right player
	}
	//*********** */

	/** GAME GRAFICS */
	/** DRAWING */
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

	/** Boders of Pong Game */
	drawBorders()
	{
		ctx.fillStyle = this.borT.color;

		// -------- Xpos, Ypos, width, height
		ctx.fillRect(0, BODMH, GAME_WIDTH, BODH);
		ctx.fillRect(0, GAME_HEIGHT - (BODMH + BODH), GAME_WIDTH, BODH);
	}

	//For visual testing of goal corners
	drawCorners()
	{
		ctx.fillStyle = this.corL.color;
		ctx.fillRect(this.corL.x, this.corL.y, this.corL.width, this.corL.height);
		ctx.fillStyle = this.corR.color;
		ctx.fillRect(this.corR.x - this.corR.width, this.corR.y, this.corR.width, this.corR.height);
	}

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

		this.drawCorners();
	}
	//*********** */
	/**----------------- */

	decideServe()
	{
		let nextS = Math.random() < 0.5 ? true : false;
		this.playerL.serve = nextS;
		this.playerR.serve = !nextS;

		//wait 2 seconds before serving

		// Random initial direction
		this.ball.dirY = (Math.random() * 2 - 1); // between -1 and 1
		if (pong.playerL.serve)
			pong.ball.dirX = 1;
		else
			pong.ball.dirX = -1;
	}

	/** ON-START */
	startBall()
	{
		// Start ball coordinates
		this.ball.vel = BALL_VEL;
		this.ball.x = this.width / 2;
		this.ball.y = this.height / 2;

		this.drawBall(this.ball);
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
	startGamePosition()
	{
		this.drawBorders();
		this.startBall();
		this.startPaddles();
	}
	initializeGame()
	{
		// Set the corners
		this.corL.x = 0;
		this.corL.y = 0;
		this.corR.x = this.width;
		this.corR.y = 0;

		// Set the borders
		this.borT.x = 0;
		this.borT.y = 0;
		this.borB.x = 0;
		this.borB.y = this.height - this.borB.height;

		// Set initial positions
		this.drawMidLine();
		this.startGamePosition();

		//* Start players
		// Player Left
		//this.playerL.name = "" // set this with database info
		this.playerL.score = 0;
		this.playerL.my_paddle = this.padL;
		this.playerL.corner = this.corL;

		// Player Right
		//this.playerR.name = "" // set this with database info
		this.playerR.score = 0;
		this.playerR.my_paddle = this.padR;
		this.playerR.corner = this.corR;

		this.decideServe();
		console.log(this.playerL);
	}
	/**----------------- */

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
	}

	updateBallPosition(ball)
	{
		ball.x += ball.dirX * ball.vel;
		ball.y += ball.dirY * ball.vel;

		if (ball.x >= this.width || ball.x <= 0)
		{
			// Ball has gone past left or right edge
			console.log("Goal!");
			// Reset ball position to center
			this.startBall();
			this.decideServe();

			console.log(this.playerL.corner);
			console.log(this.playerR.corner);
		}
	}
	/**----------------- */
}

export let pong = new Pong();
