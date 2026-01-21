/* **********************************************/
/*                   AI PONG                    */
/* **********************************************/

import { pong } from "./OBPong.js";

//** AI  */
export class AI
{
	constructor()
	{
		this.enabled = true;
		this.level = "hard";
		this.chance = 35;

		this.setLevel(pong.padR, this.level);
	}

	setLevel(pad, level)
	{
		if (!level)
			level = this.level;
		switch (level)
		{
			case "easy":
				pad.maxAcc			=	0.8;	// Aceleración máxima
				pad.damping			=	0.88;	// Amortiguación
				break;

			case "mid":
				pad.maxAcc			=	1;		// Aceleración máxima
				pad.damping			=	0.9;	// Amortiguación
				break;

			case "hard":
				pad.maxAcc			=	1.2;	// Aceleración máxima
				pad.damping			=	0.92;	// Amortiguación
				break;

			default:
				pad.maxAcc			=	1;		// Aceleración máxima
				pad.damping			=	0.9;	// Amortiguación
				break;
		}
		pad.smoothVel = 0;
	}
	smoothIT(paddle)
	{
		paddle.smoothVel *= paddle.damping;

		if (Math.abs(paddle.smoothVel) < 0.1)
			paddle.smoothVel = 0;

		if (paddle.dirY !== 0) {
			const acceleration = paddle.dirY * paddle.maxAcc;
			paddle.smoothVel += acceleration;

			// Limitar velocidad máxima (más permisivo)
			const maxSpeed = paddle.vel * 1.2;  // Aumentado el límite
			paddle.smoothVel = Math.max(
				Math.min(paddle.smoothVel, maxSpeed),
				-maxSpeed
			);
		}

		paddle.y += paddle.smoothVel;

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
	}
	/**----------------- */
}

export let ai = new AI();
