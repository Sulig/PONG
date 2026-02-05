/* **********************************************/
/*                 PHYSICS                      */
/* **********************************************/

/** Collision detection - FOR BALL - */
export function checkPaddleCollision(ball, paddle)
{
	// AABB - Circle collision detection
	const ballLeft = ball.x - ball.rad;
	const ballRight = ball.x + ball.rad;
	const ballTop = ball.y - ball.rad;
	const ballBottom = ball.y + ball.rad;

	const paddleLeft = paddle.x;
	const paddleRight = paddle.x + paddle.width;
	const paddleTop = paddle.y;
	const paddleBottom = paddle.y + paddle.height;

	if ( ballRight > paddleLeft && ballLeft < paddleRight
		&& ballBottom > paddleTop && ballTop < paddleBottom ){

		// Collision detected
		ball.dirX *= -1;

		// Ajustar dirección Y según el punto de impacto
		const hitPoint = (ball.y - paddle.y) / paddle.height; // 0 arriba, 1 abajo
		ball.dirY = (hitPoint - 0.5) * 2; // valores entre -1 y 1
	}
}

export function checkWallCollision(ball, border)
{
	// AABB - Circle collision detection
	const ballLeft = ball.x - ball.rad;
	const ballRight = ball.x + ball.rad;
	const ballTop = ball.y - ball.rad;
	const ballBottom = ball.y + ball.rad;

	const borderLeft = border.x;
	const borderRight = border.x + border.width;
	const borderTop = border.y;
	const borderBottom = border.y + border.height;

	if ( ballRight > borderLeft && ballLeft < borderRight
		&& ballBottom > borderTop && ballTop < borderBottom ){

		// Collision detected
		ball.dirY *= -1;
	}
}
/*----------------- */

export function checkCornerCollision(ball, corner)
{
	// AABB - Circle collision detection
	const ballLeft = ball.x - ball.rad;
	const ballRight = ball.x + ball.rad;
	const ballTop = ball.y - ball.rad;
	const ballBottom = ball.y + ball.rad;

	const cornerL = corner.x;
	const cornerR = corner.x + corner.width;
	const cornerT = corner.y;
	const cornerB = corner.y + corner.height;

	if ( ballRight > cornerL && ballLeft < cornerR
		&& ballBottom > cornerT && ballTop < cornerB ){
		return true;
	}
	else
		return false;
}
/* **********************************************/
