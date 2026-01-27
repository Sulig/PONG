/* **********************************************/
/*                   AI PONG                    */
/* **********************************************/

//** AI  */
export class AI
{
	constructor()
	{
		this.enabled = true;
		this.level = "mid";
		this.chance = 55;
	}

	setLevel(ball, pad, level)
	{
		if (!level)
			level = this.level;

		/* Custom dificulty:
			- for more dificulty, more chance to move
			- for les dificulty, less chance to move
		*/
		switch (level)
		{
			case	"easy":
				this.chance			=	55;
				pad.maxAcc			=	1;
				pad.damping			=	0.78;
				pad.vel				=	18;
				ball.maxVel			=	12;
				break;

			case	"mid":
				this.chance			=	100;
				pad.maxAcc			=	3;
				pad.damping			=	0.8855;
				pad.vel				=	65;
				ball.maxVel			=	14;
				break;

			case	"hard":
				this.chance			=	100;
				pad.maxAcc			=	5;
				pad.damping			=	0.89;
				pad.vel				=	75;
				ball.maxVel			=	15;
				break;

			default:
				this.chance			=	100;
				pad.maxAcc			=	3;
				pad.damping			=	0.8855;
				pad.vel				=	65;
				ball.maxVel			=	14;
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
		} else if (paddle.y + paddle.height > paddle.maxY) {
			paddle.y = paddle.maxY - paddle.height;
		}
	}
	//*********** */

	basicAI(ball, pad)
	{
		const centerY = ball.y - pad.height / 2;
		const currentCenter = pad.y + pad.height / 2;
		const diff = centerY - currentCenter;

		var random = Math.random() * 100;
		if (random <= this.chance)
		{
			if (ball.y < pad.y)
				pad.dirY = -1;
			else if (ball.y > pad.y + pad.height)
				pad.dirY = 1;
			else
				pad.dirY = 0;
		}
		else if (random <= this.chance + 15)
		{
			if (Math.abs(diff) > 15)
				pad.dirY = diff > 0 ? 0.7 : -0.7;
			else
				pad.dirY = 0;
		}
		else if (random <= this.chance + 20)
		{
			if (Math.random() < 0.4)
				pad.dirY = (Math.random() * 2 - 1) * 0.3;
			else
				pad.dirY = 0;
		}
		else
			pad.dirY = 0;

		this.smoothIT(pad);
	}



	ai(ball, pad)
	{
		if (!this.enabled)
			return ;

		if (this.level === "hard")
			this.basicAI(ball, pad);
		else
			this.basicAI(ball, pad);
	}
	/**----------------- */
}

export let ai = new AI();
