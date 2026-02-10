/* **********************************************/
/*                 Objects PONG                 */
/* **********************************************/

import { checkCornerCollision } from "./phisics.js";
import { ai } from "./AI.js"

/**-- gmscale */
export const GAME_WIDTH		= 640 * 2;
export const GAME_HEIGHT	= 480 * 2;
export const gm_margin		= 10;

/* ball texture */
export const _tx = new Image();
_tx.src = "/assets/error-tile_TV.png";
/****/

/** OBJECTS -- */
const WAIT_SERVE = 180; // Time to wait before serve (fps so 180 is 3s)

// 	** BALL */
const START_BALL_VEL = 0;
const BALL_ACCELERATION = 0.15;
const BALL_VEL	=	12;
const BALL_RAD	=	20;
const BALL = {
	color:	"black",
	rad:	BALL_RAD,
	vel:	BALL_VEL,
	maxVel:	BALL_VEL,
	x:		0,
	y:		0,
	dirX:	0,
	dirY:	0,
	is_stuck:	false,
	frameStuck:	0
};

const BODMH = 20;	// Border for MidLine grafic
const BORDER = {
	color:	"white",
	width:	GAME_WIDTH,
	height:	1,
	x:		0,
	y:		0
};

const CWIDTH = 70, CHEIGHT = 70;
const CORNER = {
	color:	"red",
	width:	CWIDTH + BALL_RAD,
	height:	CHEIGHT + BALL_RAD,
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
const MAX_SCORE = 5;
const SCORE_SIZE = 120;
const FONT_SIZE = SCORE_SIZE + "px";
const FONT_SCORE = FONT_SIZE + " Arial";
const SCORE_MARGIN = 85;
const SCORE = {
	max_score:	MAX_SCORE,
	score: 0,
	size: SCORE_SIZE,
	font: "Arial",
	color:	'yellow',
	x: 0,
	y: SCORE_SIZE + SCORE_MARGIN
};

// 	** PADDLE */
// -- width, height, velocity
const PADW = 16, PADH = 100, PADVEL = 18;
const PAD = {
	ai_enable:	false,	// Enable/disable
	color:	"burlywood",
	width:	PADW,
	height:	PADH,
	vel:	PADVEL,
	smoothVel:	0,		// Velocidad actual suavizada
	maxAcc:		1,		// Aceleración máxima
	damping:	0.9,	// Amortiguación
	reactionDelay:	0,	// Retardo de reacción
	x:		0,
	y:		0,
	maxY:	GAME_HEIGHT,
	dirY:	0
};

//** PLAYER  */
const PLAYER = {
	name: "Player",
	serve:  false,
	score: null,
	my_pad: null,
	goal: null,
	mov_u:	"w",	//	Move up key
	mov_d:	"s"		//	Move down key
};
/** */
/**----------------- */
export class Pong
{
	constructor()
	{
		this.canvas = null;
		this.ctx = null;
		//this.setCanvas(null);

		this.width = GAME_WIDTH;
		this.height = GAME_HEIGHT;
		this.margin = gm_margin;

		this.set = null;

		this.borT = Object.create(BORDER);		// border top
		this.borB = Object.create(BORDER);		// border bottom

		this.corTL = Object.create(CORNER);
		this.corTR = Object.create(CORNER);
		this.corBL = Object.create(CORNER);
		this.corBR = Object.create(CORNER);

		this.gL = Object.create(GOAL);			// Left Goal Corner
		this.gR = Object.create(GOAL);			// Right Goal Corner

		this.ball = Object.create(BALL);		// Da ball

		this.padL = Object.create(PAD);			// Left paddle
		this.padR = Object.create(PAD);			// Right paddle

		this.ai			=	ai;
		this.playerL	= Object.create(PLAYER);	// Left player
		this.playerR	= Object.create(PLAYER);	// Right player
		this.playerR.mov_u = "ArrowUp";
		this.playerR.mov_d = "ArrowDown";

		this.maxPoints = MAX_SCORE;
		this.serveNow = false;
		this.waitServe = WAIT_SERVE;
		this.screenText = Object.create(SCORE);
		this.log_app = 0;	// Limit the console logs at only 1
	}
	//*********** */

	setCanvas(canvas)
	{
	    console.log("canvas is: --" + canvas);
		if (canvas != null)
			this.canvas = canvas;
		else
			this.canvas = document.getElementById("gm-canvas");
		this.ctx = this.canvas.getContext("2d");
		console.log("canvas is: --" + this.canvas);
		
		this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = "high";
	}

	setDefPad(pad)
	{
		pad.ai_enable	=	PAD.ai_enable;
		pad.color		=	PAD.color;
		pad.width		=	PADW;
		pad.height		=	PADH;
		pad.vel			=	PADVEL;
		pad.smoothVel	=	0;
		pad.maxAcc		=	1;
		pad.damping		=	0.9;
		pad.reactionDelay	=	0;
	}

	/** ON-START */
	initializeGame(pongSet)
	{
		console.log(pongSet);
		this.set = pongSet;

		this.maxPoints = pongSet.maxPoints;
		this.serveNow = false;
		this.waitServe = WAIT_SERVE;
		this.screenText.score = WAIT_SERVE / 60;
		this.screenText.x = this.width / 2 - SCORE_SIZE / 2 + 25;
		this.screenText.y = this.height / 2 + SCORE_SIZE / 2 - 25;
		this.log_app = 0;

		// Set the goals
		this.gL.x = 0;
		this.gL.y = 0;
		this.gR.x = this.width;
		this.gR.y = 0;

		// Set the borders
		this.borT.x = 0;
		this.borT.y = 0;
		this.borB.x = 0;
		this.borB.y = GAME_HEIGHT - BORDER.height;

		// Set the corners
		this.corTL.x = 0;
		this.corTL.y = 0;
		this.corTR.x = this.width - CWIDTH;
		this.corTR.y = 0;
		this.corBL.x = 0;
		this.corBL.y = this.height - CHEIGHT;
		this.corBR.x = this.width - CWIDTH;
		this.corBR.y = this.height - CHEIGHT;

		//* Start players
		// Player Left
		this.setDefPad(this.padL);

		this.playerL.name = pongSet.plL_name; // set this with database info
		this.playerL.my_pad = this.padL;
		this.playerL.goal = this.gL;
		this.playerL.mov_u = pongSet.plL_mvu;
		this.playerR.mov_d = pongSet.plL_mvd;
		// -- score
		this.playerL.score = Object.create(SCORE);
		this.playerL.score.score = 0;
		this.playerL.score.x = this.width / 2 - SCORE_MARGIN * 2;
		//-- AI
		if (pongSet.mode == "1vsAI" && pongSet.your_pad == "right")
			this.ai.setLevel(pong.ball, pong.padL, pongSet.ai_level);

		// Player Right
		this.setDefPad(this.padR);

		this.playerR.name = pongSet.plR_name; // set this with database info
		this.playerR.my_pad = this.padR;
		this.playerR.goal = this.gR;
		this.playerR.mov_u = pongSet.plR_mvu;
		this.playerR.mov_d = pongSet.plR_mvd;
		// -- score
		this.playerR.score = Object.create(SCORE);
		this.playerR.score.score = 0;
		this.playerR.score.x = this.width / 2 + SCORE_MARGIN;
		//-- AI
		if (pongSet.mode == "1vsAI" && pongSet.your_pad == "left")
			this.ai.setLevel(pong.ball, pong.padR, pongSet.ai_level);

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
		this.ball.is_stuck = false;
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
		this.serveNow = false;
		this.waitServe = WAIT_SERVE;
		this.screenText.score = WAIT_SERVE / 60;
		this.startBall();
		this.startPaddles();
	}
	/**----------------- */

	/** DRAWING */
	drawScore(score)
	{
		this.ctx.font = FONT_SCORE;
		this.ctx.strokeStyle = score.color;
		//this.ctx.fillText(score.score + "", score.x, score.y); // Texto con relleno
		this.ctx.strokeText(score.score + "", score.x, score.y); // Texto con contorno (sin relleno)
	}
	drawPaddle(paddle)
	{
		this.ctx.fillStyle = paddle.color;
		this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
	}
	drawBall(ball)
	{
		this.ctx.strokeStyle = 'red';
		this.ctx.beginPath();
		this.ctx.arc(ball.x, ball.y, ball.rad, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = ball.color;
		this.ctx.fill();
		this.ctx.stroke();
	}

	/** Mid line (only grafic, has no collider) */
	drawMidLine()
	{
		this.ctx.strokeStyle = 'darkviolet';
		this.ctx.lineWidth = 8;
		// -- Dash line - long, spacing
		this.ctx.setLineDash([30, 38]);
		//ctx.beginPath();
		this.ctx.moveTo(GAME_WIDTH / 2, BODMH);
		this.ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT - BODMH);
		this.ctx.stroke();
		//reset style
		this.ctx.setLineDash([0, 0]);
	}

	/** Boders of Pong Game */
	drawBorders()
	{
		this.ctx.fillStyle = this.borT.color;

		// -------- Xpos, Ypos, width, height
		this.ctx.fillRect(this.borT.x, this.borT.y, GAME_WIDTH, this.borT.height);
		this.ctx.fillRect(this.borB.x, this.borB.y, GAME_WIDTH, this.borB.height);
	}

	//For visual testing of goal goals
	drawGoals()
	{
		this.ctx.fillStyle = this.gL.color;
		this.ctx.fillRect(this.gL.x, this.gL.y, this.gL.width, this.gL.height);
		this.ctx.fillStyle = this.gR.color;
		this.ctx.fillRect(this.gR.x - this.gR.width, this.gR.y, this.gR.width, this.gR.height);
	}

	/** Redraw the entire game screen */
	reDraw()
	{
		// Clear the canvas
		this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

		// Draw borders and mid line
		this.drawBorders();
		this.drawMidLine();

		this.drawScore(this.playerL.score);
		this.drawScore(this.playerR.score);

		// Draw paddles and ball
		this.drawBall(this.ball);
		this.drawPaddle(this.padL);
		this.drawPaddle(this.padR);

		if (!this.serveNow)
			this.drawScore(this.screenText);

		//this.drawGoals();
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
		if (this.playerL.serve)
			this.ball.dirX = 1;
		else
			this.ball.dirX = -1;
	}

	countDownServe()
	{
		if (this.waitServe > 0)
		{
			this.serveNow = false;
			this.drawScore(this.screenText);
			if (this.waitServe % 60 == 0)
				this.screenText.score = this.waitServe / 60;
			this.waitServe--;
		}
		else
			this.serveNow = true;
	}

	checkIfBallStuck(ball)
	{
		ball.is_stuck = false;

		if (checkCornerCollision(ball, this.corTL) ||
			checkCornerCollision(ball, this.corTR) ||
			checkCornerCollision(ball, this.corBL) ||
			checkCornerCollision(ball, this.corBR)) {
				ball.is_stuck = true;
		}

		if (ball.is_stuck)
		{
			ball.frameStuck++;
			if (ball.frameStuck > 180)
			{
				ball.frameStuck = 0;
				this.startBall();
			}
		}
		else
			ball.frameStuck = 0;
	}
	/**----------------- */

	/** MOVEMENT */
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

		if (ball.vel <= ball.maxVel)
			ball.vel += BALL_ACCELERATION;

		if (ball.x <= this.playerL.goal.x)
		{
			this.playerR.score.score++;
			if (this.playerR.score.score >= this.maxPoints)
			{
				// end game
				console.log("Player R wins!");
				// Saltar a la pantalla de estadisticas y resultados --
				//--- here
				//** Esto es solo para test y reinicia el juego -> */
				this.initializeGame(this.set);
			}
			else
				this.decideServe();
		}
		if (ball.x >= this.playerR.goal.x)
		{
			this.playerL.score.score++;
			if (this.playerL.score.score >= this.maxPoints)
			{
				// end game
				console.log("Player L wins!");
				// Saltar a la pantalla de estadisticas y resultados --
				//--- here
				//** Esto es solo para test y reinicia el juego -> */
				this.initializeGame(this.set);
			}
			else
				this.decideServe();
		}
	}
	/**----------------- */
}

export let pong = new Pong();
