/* **********************************************/
/*                   AI PONG                    */
/* **********************************************/

//** AI  */
export class AI
{
	constructor()
	{
		this.level		=	"mid";	// Level of AI (easy - mid - hard)
		this.chance		=	55;		// Chance of AI for mistakes
		this.velMax		=	60;		// Max velocoty of pad
	}

	setLevel(ball, pad, level)
	{
		pad.ai_enable = true;

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
				this.chance			=	20;
				pad.maxAcc			=	2;
				pad.damping			=	0.8;
				pad.vel				=	40;
				this.velMax			=	40;
				ball.maxVel			=	12;
				break;

			case	"mid":
				this.level			=	"mid";
				this.chance			=	10;
				pad.maxAcc			=	2.5;
				pad.damping			=	0.88;
				pad.vel				=	60;
				this.velMax			=	60;
				ball.maxVel			=	14;
				break;

			case	"hard":
				this.level			=	"hard";
				this.chance			=	2;
				pad.maxAcc			=	5;
				pad.damping			=	0.89;
				pad.vel				=	75;
				this.velMax			=	75;
				ball.maxVel			=	16;
				break;

			default:
				this.level			=	"mid";
				this.chance			=	10;
				pad.maxAcc			=	3;
				pad.damping			=	0.88;
				pad.vel				=	60;
				this.velMax			=	60;
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

			// Limitar velocidad máxima
			const maxSpeed = paddle.vel * 1.2;
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
		if (ball.y < pad.y)
			pad.dirY = -1;
		else if (ball.y > pad.y + pad.height)
			pad.dirY = 1;
		else
			pad.dirY = 0;

		var random = Math.floor(Math.random() * 100);
		if (random < this.chance)
		{
			console.log("I will stop for you");
			if (Math.random() < 0.4)
				pad.dirY = (Math.random() * 2 - 1) * 0.3;
			pad.vel /= 7;
		}
		else if (pad.vel < this.velMax)
			pad.vel++;

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

		var random = Math.floor(Math.random() * 100);
		if (random < this.chance)
		{
			console.log("I will stop for you");
			if (Math.random() < 0.4)
				pad.dirY = (Math.random() * 2 - 1) * 0.3;
			pad.vel /= 5;
		}
		else if (pad.vel < this.velMax)
			pad.vel++;

		//console.log(pad);

		this.smoothIT(pad);
	}

	ai(ball, pad)
	{
		if (!pad.ai_enable)
			return ;

		if (this.level == "hard")
			this.predictiveAI(ball, pad);
		else
			this.basicAI(ball, pad);

		//console.log(this);
	}
	/**----------------- */
}

export let ai = new AI();
