/* **********************************************/
/*                Settings PONG                 */
/* **********************************************/

console.log("settings test");

export class PongSettings
{
	constructor()
	{
		this.device		= "PC"		// Localy changed, if you are playing in PC - Mobile
		this.maxPoints	= 5			// Number of points necessary for winning
		this.mode		= "1vsAI"	// You can set it to: 1vsAI - 1vs1Off - (and 1vs1On if finally do the online )
		this.ai_level	= "hard"	// Level of AI (easy - mid - hard)
		this.your_pad	= "left"	// What pad do you want to manage (left - right)
		//----------
		this.plL_name	= "test"		//	Player Left name
		this.plL_mouse	= true;			//	Set to true -> activate mouse controller 
		this.plL_mvu	= "w"			//	Player Left Move Up key - actual - W
		this.plL_mvd	= "s"			//	Player Left Move Down key - actual - S
		//*
		this.plR_name	= "test"		//	Player Right name
		this.plR_mouse	= false;
		this.plR_mvu	= "ArrowUp"		//	Player Right Move Up key - actual - ArrowUp
		this.plR_mvd	= "ArrowDown"	//	Player Right Move Down key - actual - ArrowDown
		//----------
	}


}

export let pongSet = new PongSettings();
