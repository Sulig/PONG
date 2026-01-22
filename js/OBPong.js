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
const START_BALL_VEL = 0;
const BALL_ACCELERATION = 0.15;
const BALL_VEL = 12;
const BALL = {
	color:	"white",
	rad:	20,
	vel:	BALL_VEL,
	x:		0,
	y:		0,
	dirX:	0,
	dirY:	0,
	frameStuck: 0
};

export const BODMH = 20;	// Border for MidLine grafic
//const BODH = 10;			// Border Height (will need this for collisions)
const BORDER = {
	color:	"white",
	width:	GAME_WIDTH,
	height:	0,
	x:		0,
	y:		0
};

//** GOAL */
const GOAL = {
	color:	"yellow",
	height:	GAME_HEIGHT,
	width:	6,
	x:		0,
	y:		0,
};

//** SCORE */
const SCORE_SIZE = 120;
const FONT_SIZE = SCORE_SIZE + "px";
export const FONT_SCORE = FONT_SIZE + " Arial";
const SCORE_MARGIN = 85;
const SCORE = {
	score: 0,
	size: SCORE_SIZE,
	font: "Arial",
	x: 0,
	y: SCORE_SIZE + SCORE_MARGIN
};

// 	** PADDLE */
// -- width, height, velocity
const PADW = 16, PADH = 100;
export const PADVEL = 18;
export const PAD = {
	color:	"white",
	width:	PADW,
	height:	PADH,
	vel:	PADVEL,
	smoothVel:	0,		// Velocidad actual suavizada
	maxAcc:		1,	// Aceleración máxima
	damping:	0.9,	// Amortiguación
	reactionDelay:	0,	// Retardo de reacción
	x:		0,
	y:		0,
	dirY:	0
};

//** PLAYER  */
export const MAX_SCORE = 5;
export const PLAYER = {
	name: "Player",
	serve:  false,
	score: null,
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

		this.borT = Object.create(BORDER);		// border top
		this.borB = Object.create(BORDER);		// border bottom

		this.corL = Object.create(GOAL);	// Left Goal Corner
		this.corR = Object.create(GOAL);	// Right Goal Corner

		this.ball = Object.create(BALL);		// Da ball
		this.padL = Object.create(PAD);			// Left paddle
		this.padR = Object.create(PAD);			// Right paddle

		this.playerL = Object.create(PLAYER);	// Left player
		this.playerR = Object.create(PLAYER);	// Right player
	}
	//*********** */

	/** ON-START */
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
		this.borB.y = GAME_HEIGHT;

		//* Start players
		// Player Left
		//this.playerL.name = "" // set this with database info
		this.playerL.my_pad = this.padL;
		this.playerL.corner = this.corL;
		// -- score
		this.playerL.score = Object.create(SCORE);
		this.playerL.score.score = 0;
		this.playerL.score.x = this.width / 2 - SCORE_MARGIN * 2;

		// Player Right
		//this.playerR.name = "" // set this with database info
		this.playerR.my_pad = this.padR;
		this.playerR.corner = this.corR;
		// -- score
		this.playerR.score = Object.create(SCORE);
		this.playerR.score.score = 0;
		this.playerR.score.x = this.width / 2 + SCORE_MARGIN;

		// Draw Scenario
		this.drawMidLine();
		this.drawBorders();

		// Set initial positions
		this.startGamePosition();
		this.decideServe();
	}
	startBall()
	{
		// Start ball coordinates
		this.ball.frameStuck = 0;
		this.ball.vel = START_BALL_VEL;
		this.ball.x = this.width / 2;
		this.ball.y = this.height / 2;

		this.drawBall(this.ball);
	}
	startPaddles()
	{
		const centerY = this.height / 2;
		// -- * LEFT PADDLE
		this.padL.x = 0;
		this.padL.y = centerY - this.padL.height / 2;
		this.padL.smoothVel = 0;
		this.drawPaddle(this.padL);

		// -- * RIGHT PADDLE
		this.padR.x = this.width - this.padR.width;
		this.padR.y = centerY - this.padR.height / 2;
		this.padR.smoothVel = 0;
		this.drawPaddle(this.padR);
	}
	/**----------------- */
	startGamePosition()
	{
		this.startBall();
		this.startPaddles();
	}
	/**----------------- */

	/** DRAWING */
	drawScore(score)
	{
		ctx.font = FONT_SCORE;
		ctx.fillText(score.score + "", score.x, score.y); // Texto con relleno
		//ctx.strokeText(score.score + "", score.x, score.y); // Solo letra con contorno (no se ve visualmente bien asi que usa "filled")
	}
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
		ctx.fillRect(this.borT.x, this.borT.y, GAME_WIDTH, this.borT.height);
		ctx.fillRect(this.borB.x, this.borB.y, GAME_WIDTH, this.borB.height);
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

		this.drawScore(this.playerL.score);
		this.drawScore(this.playerR.score);

		// Draw paddles and ball
		this.drawBall(this.ball);
		this.drawPaddle(this.padL);
		this.drawPaddle(this.padR);

		//this.drawCorners();
	}
	//*********** */
	/**----------------- */

	/** UTILITIES */
	decideServe()
	{
		this.startBall();

		let nextS = Math.random() < 0.5 ? true : false;
		this.playerL.serve = nextS;
		this.playerR.serve = !nextS;

		// Random initial direction
		this.ball.dirY = (Math.random() * 2 - 1); // between -1 and 1
		if (pong.playerL.serve)
			pong.ball.dirX = 1;
		else
			pong.ball.dirX = -1;
	}

	checkIfBallStuck()
	{

		//only for tests:
		ctx.beginPath();
		ctx.arc(95, 50, 40, 0, 2 * Math.PI);
		ctx.stroke();
	}
	/**----------------- */

	/** MOVEMENT */
	movePaddle(paddle, nextY)
	{
		paddle.y += paddle.vel * nextY;
		// Ensure paddle stays within game bounds
		if (paddle.y < 0) {
			paddle.y = 0;
		} else if (paddle.y + paddle.height > this.height) {
			paddle.y = this.height - paddle.height;
		}
	}

	updatePaddlePosition(paddle)
	{
		paddle.y += paddle.dirY * paddle.vel;
		// Ensure paddle stays within game bounds
		if (paddle.y < 0) {
			paddle.y = 0;
		} else if (paddle.y + paddle.height > this.height) {
			paddle.y = this.height - paddle.height;
		}
	}

	updateBallPosition(ball)
	{
		ball.x += ball.dirX * ball.vel;
		ball.y += ball.dirY * ball.vel;

		if (ball.vel <= BALL_VEL)
			ball.vel += BALL_ACCELERATION;

		if (ball.x <= this.playerL.corner.x)
		{
			this.playerL.score.score++;
			if (this.playerL.score.score >= MAX_SCORE)
			{
				// end game
				console.log("Player L wins!");
				// Saltar a la pantalla de estadisticas y resultados --
				//--- here
				//** Esto es solo para test y reinicia el juego -> */
				this.initializeGame();
			}
			else
				this.decideServe();
		}
		if (ball.x >= this.playerR.corner.x)
		{
			this.playerR.score.score++;
			if (this.playerR.score.score >= MAX_SCORE)
			{
				// end game
				console.log("Player R wins!");
				// Saltar a la pantalla de estadisticas y resultados --
				//--- here
				//** Esto es solo para test y reinicia el juego -> */
				this.initializeGame();
			}
			else
				this.decideServe();
		}
	}
	/**----------------- */
}

export let pong = new Pong();
