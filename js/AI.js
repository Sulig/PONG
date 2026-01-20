/* **********************************************/
/*                   AI PONG                    */
/* **********************************************/

import { pong, PAD, PADVEL } from "./OBPong.js";

// 	** AI PADDLE */
// -- width, height, velocity
// PADVEL = 18;
const AIPAD = {
	color:	PAD.color,
	width:	PAD.width,
	height:	PAD.height,
	vel:	PADVEL,
	smoothVel:	0,		// Velocidad actual suavizada
	maxAcc:		1,	// Aceleración máxima
	damping:	0.9,	// Amortiguación
	reactionDelay:	0,	// Retardo de reacción
	x:		0,
	y:		0,
	dirY:	0
};

//** AI  */
export class AI
{
	constructor()
	{
		this.enabled = true;
		this.aipad = Object.create(AIPAD);
		this.dificuty = "mid";
	}

	smoothIT(paddle)
	{
		// set
		this.aipad.x = paddle.x;
		this.aipad.y = paddle.y;
		this.aipad.dirY = paddle.dirY;

		// move
		this.aipad.smoothVel *= this.aipad.damping;

		if (Math.abs(this.aipad.smoothVel) < 0.1)
			this.aipad.smoothVel = 0;

		if (this.aipad.dirY !== 0) {
			const acceleration = this.aipad.dirY * this.aipad.maxAcc;
			this.aipad.smoothVel += acceleration;

			// Limitar velocidad máxima (más permisivo)
			const maxSpeed = this.aipad.vel * 1.2;  // Aumentado el límite
			this.aipad.smoothVel = Math.max(
				Math.min(this.aipad.smoothVel, maxSpeed),
				-maxSpeed
			);
		}

		this.aipad.y += this.aipad.smoothVel;
		paddle.y = this.aipad.y;

		// Ensure paddle stays within game bounds
		if (paddle.y < 0) {
			paddle.y = 0;
		} else if (paddle.y + paddle.height > pong.height) {
			paddle.y = pong.height - paddle.height;
		}
	}
	//*********** */

	ai(ball, pad)
	{
		if (!this.enabled)
			return ;

		/* Custom dificulty:
			- for more dificulty, more chance to move
			- for les dificulty, less chance to move
		*/

		var chance = 0;
		if (this.dificuty == "easy")
			chance = 20;
		else if (this.dificuty == "mid")
			chance = 50;
		else if (this.dificuty == "hard")
			chance = 80;

		var random = Math.random() * 100;

		if (random <= chance)
		{
			if (ball.y < pad.y)
				pad.dirY = -1;
			else if (ball.y > pad.y)
				pad.dirY = 1;
			else
				pad.dirY = 0;
		}
		else if (random <= chance + 15)
		{
			if (ball.y < pad.y)
				pad.dirY = -0.5;
			else if (ball.y > pad.y)
				pad.dirY = 0.5;
			else
				pad.dirY = 0;
		}
		else if (random <= chance + 20)
		{
			if (ball.y < pad.y)
				pad.dirY = -0.25;
			else if (ball.y > pad.y)
				pad.dirY = 0.25;
			else
				pad.dirY = 0;
		}
		else
			pad.dirY = 0;

		this.smoothIT(pad);
		pong.updatePaddlePosition(pad);
	}
	/**----------------- */
}

export let ai = new AI();
