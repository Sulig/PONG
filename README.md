# PONG

~ Started on: 11/12/2025 ~ *** ~ Ended on: IN PROGRESS

> [!WARNING]\
> This repository is IN PROGRESS
> See `Backlog PONG` to see what i'm doing.

## DESCRIPT
For the game -- Will be PONG --
* (Si hay tiempo, se pueden anyadir mas juegos)

### Rules
Classic PONG game, the ball rebotes on the max top & max bottom height.
+ La pelota rebota en las palas
+ En la primera instancia, se decide aleatoriamente hacia donde se dirigira la bola (si J1 o J2)
+ Cuando un jugador marque, se le asignara un punto y la bola se sacara desde el jugador que ha perdido.
+ El juego termina cuando alguien haya ganado X puntos.

## Controllers
+ 1 player vs 1 (CPU or online)
	> [Aun no implementado] Mediante el "scroll" del raton puedes subir/bajar la pala
	> Arrow up & Arrow down -> Mover la pala correspondiente
	>> (-- Podria anyadir una modificacion donde el jugador pueda decidir que tecla usar)

	> (En mobil) -> Deslizar horizontalmente para mover la pala.

+ 1 vs 1 in local.
	> W & S -> Para mover la pala del J1
	> Arrow Up & Down -> Mover la pala del J2
	>> Podria hacerlo customizable.

+ 1 vs AI
	> W & S -> para mover la pala
	> [No implementado] - Mediante el "scroll" del raton puedes subir/bajar la pala
	>> (-- Podria anyadir una modificacion donde el jugador pueda decidir que tecla usar)

	> No me planteo una version multijugador en mobil (Podria añadir dos sliders, pero podria ser algo engorroso)
***

## IDEAS:

* Implement Arkanoid Random "Ventajas" & Power-ups
- Aumentar velocidad de la bola
- Hacer aparecer mas bolas
- Aumentar/Disminuir el tamaño de las palas
.. Etc..

## CODE -> FILE DISTRIBUITION:

- AI -->
	- Only the AI mechanic and choses of difficulty of it.

- fetch -->
	- The method for restoring data saved in a JSON

- OBJPong -->
	- All the necessary objects and structs for pong game
	- All the "Deffault" attributes and inicializations
	- All the Object Drawing for pong
	- An update function position for ball
	- An update function position for paddles
	- Some utilities:
		- Check if ball is stucked
		- Decide serve
		- First count down before first serve

- phisics -->
	- All the collisions of the ball with the environment
	- *Includes the collision of ball in corners for "is ball stuck?"

- In "pong" -->
	- All the key-input event listeners
	- Update method
	- Call for start - inicializations of game

- Render -->
	- Only the render method when scaling the window

***
~ Made by sadoming ~
***
