/* **********************************************/
/*                   AI PONG                    */
/* **********************************************/

//** AI  */
export class AI
{
	constructor()
	{
		this.enabled = true;	// Enable/Disable the AI
		this.level = "mid";		// Level of AI (easy - mid - hard)
		this.chance = 55;		// Chance of AI for mistakes
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
				this.level			=	"easy";
				this.chance			=	45;
				pad.maxAcc			=	1.5;
				pad.damping			=	0.78;
				pad.vel				=	35;
				ball.maxVel			=	12;
				break;

			case	"mid":
				this.level			=	"mid";
				this.chance			=	10;
				pad.maxAcc			=	2.5;
				pad.damping			=	0.88;
				pad.vel				=	60;
				ball.maxVel			=	14;
				break;

			case	"hard":
				this.level			=	"hard";
				this.chance			=	-1;
				pad.maxAcc			=	5;
				pad.damping			=	0.89;
				pad.vel				=	75;
				ball.maxVel			=	15;
				break;

			default:
				this.level			=	"mid";
				this.chance			=	10;
				pad.maxAcc			=	3;
				pad.damping			=	0.88;
				pad.vel				=	60;
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

		var random = Math.floor(Math.random() * 100);
		if (ball.y < pad.y)
			pad.dirY = -1;
		else if (ball.y > pad.y + pad.height)
			pad.dirY = 1;
		else
			pad.dirY = 0;

		if (random <= this.chance)
		{
			if (Math.random() < 0.4)
				pad.dirY = (Math.random() * 2 - 1) * 0.3;
			else
				pad.dirY = 0;
		}

		this.smoothIT(pad);
	}

	predictiveAI(ball, pad)
	{
		/*
		if (ball.y < pad.y)
			pad.dirY = -1;
		else if (ball.y > pad.y + pad.height)
			pad.dirY = 1;
		else
			pad.dirY = 0;
		*/

		if (ball.y + ball.dirY < pad.y)
			pad.dirY = -1;
		else if (ball.y + ball.dirY > pad.y + pad.height)
			pad.dirY = 1;
		else
			pad.dirY = 0;

		console.log(pad);

		this.smoothIT(pad);
	}

	ai(ball, pad)
	{
		if (!this.enabled)
			return ;

		if (this.level == "hard")
			this.predictiveAI(ball, pad);
		else
			this.basicAI(ball, pad);
	}
	/**----------------- */
}

export let ai = new AI();
