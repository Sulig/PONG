import { useEffect, useRef } from 'react';

const PongGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game state
    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 8,
      dx: 3,
      dy: 3,
    };

    const paddleWidth = 10;
    const paddleHeight = 80;

    const leftPaddle = {
      x: 20,
      y: canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      dy: 4,
    };

    const rightPaddle = {
      x: canvas.width - 30,
      y: canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      dy: 4,
    };

    // Draw functions
    const drawRect = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };

    const drawCircle = (x: number, y: number, r: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawNet = () => {
      for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 2, i, 4, 10, '#fff');
      }
    };

    // AI movement
    const aiMove = () => {
      const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
      if (paddleCenter < ball.y - 35) {
        rightPaddle.y += rightPaddle.dy;
      } else if (paddleCenter > ball.y + 35) {
        rightPaddle.y -= rightPaddle.dy;
      }
    };

    // Simple AI for left paddle too
    const leftAiMove = () => {
      const paddleCenter = leftPaddle.y + leftPaddle.height / 2;
      if (paddleCenter < ball.y - 35) {
        leftPaddle.y += leftPaddle.dy * 0.8;
      } else if (paddleCenter > ball.y + 35) {
        leftPaddle.y -= leftPaddle.dy * 0.8;
      }
    };

    // Collision detection
    const collision = (b: typeof ball, p: typeof leftPaddle) => {
      return (
        b.x - b.radius < p.x + p.width &&
        b.x + b.radius > p.x &&
        b.y - b.radius < p.y + p.height &&
        b.y + b.radius > p.y
      );
    };

    // Update game state
    const update = () => {
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collision (top/bottom)
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
      }

      // Paddle collision
      const paddle = ball.x < canvas.width / 2 ? leftPaddle : rightPaddle;
      if (collision(ball, paddle)) {
        ball.dx *= -1;
        const collidePoint = ball.y - (paddle.y + paddle.height / 2);
        ball.dy = collidePoint * 0.1;
      }

      // Reset ball if it goes out
      if (ball.x + ball.radius < 0 || ball.x - ball.radius > canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx *= -1;
      }

      // AI movement
      leftAiMove();
      aiMove();

      // Keep paddles in bounds
      leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
      rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));
    };

    // Render
    const render = () => {
      drawRect(0, 0, canvas.width, canvas.height, '#000');
      drawNet();
      drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, '#fff');
      drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, '#fff');
      drawCircle(ball.x, ball.y, ball.radius, '#fff');
    };

    // Game loop
    const gameLoop = () => {
      update();
      render();
    };

    const interval = setInterval(gameLoop, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border-0 border-neutral-700 rounded max-w-full h-auto"
    />
  );
};

export default PongGame;
