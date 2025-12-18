/* **********************************************/
/*                 Objects PONG                 */
/* **********************************************/

/**-- gmscale */
const GAME_WIDTH	= 1350;
const GAME_HEIGHT	= 600;
const gm_margin		= 10;

/** */
const BALL = {
	color:	"white",
	size:	20,
	vel:	5,
	x:		0,
	y:		0,
	dirX:	0,
	dirY:	0
};

const PADW = 16, PADH = 100, PADVEL = 5;
const PAD = {
	color:	"white",
	width:	PADW,
	height:	PADH,
	vel:	PADVEL,
	x:		0,
	y:		0,
	dirY:	0
}

const BODH = 10;	// Border Height (will need this for collisions)
const BODMH = 4;	// Margin Height (top - bottom)
const BODMW = 25;	// Margin Width (left - right)
const BORDER = {
	color:	"white",
	width:	GAME_WIDTH - (borderMW * 2),
	height:	BODH,
	x:		BODMW,
	y:		0
}
/**----------------- */


export class Pong
{
	constructor()
	{
		const	ball = Object.create(BALL);		// Da ball
		const	padL = Object.create(PAD);		// Left paddle
		const	padR = Object.create(PAD);		// Right paddle
		const	borT = Object.create(BORDER);	// border top
		const	borB = Object.create(BORDER);	// border bottom
	}


}
