/* **********************************************/
/*                 PHYSICS                      */
/* **********************************************/

import { pong } from "./OBPong.js";

/** Collision detection */
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
		console.log("Collision detected!");
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
		console.log("Collision detected!");
		ball.dirY *= -1;

		// Ajustar dirección X según el punto de impacto
		//const hitPoint = (ball.x - border.x) / border.width; // 0 izquierda, 1 derecha
		//ball.dirX = (hitPoint - 0.5) * 2;
	}
}

