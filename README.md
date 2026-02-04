# PONG

~ Started on: 11/12/2025 ~ *** ~ Ended on: IN PROGRESS

> [!WARNING]\
> This repository is IN PROGRESS
> See `Backlog PONG` to see what i'm doing.

## DESCRIPT
For the game -- Will be PONG --

### Rules
Classic PONG game, the ball rebotes on the max top & max bottom height.
+ La pelota rebota en las palas
+ En la primera instancia, se decide aleatoriamente hacia donde se dirigira la bola (si J1 o J2)
+ Cuando un jugador marque, se le asignara un punto y la bola se sacara desde el jugador que ha perdido.
+ El juego termina cuando alguien haya ganado X puntos.

### Game customizatation
- Seleccionar cuantos puntos se necesitan para ganar una partida.
- Seleccionar si se jugara 1 vs 1 (offline)
- Seleccionar si se jugara 1 vs AI
- Seleccionar en que lado de la pantalla se movera a AI
- Seleccionar la dificultad de la AI

## Controllers
+ Decide que pala quieres usar (cuando compitas contra la AI) y -->
+ 'w' y 's'		-> Controla la pala izquierda
+ Arrow up & Arrow down	-> Controla la pala derecha

>> (-- el jugador puede decidir que tecla usar, solo que eso no esta implementado en el frontend)
>> (O Mediante el "scroll" del raton -> puedes subir/bajar la pala)

> (En mobil) -> Deslizar horizontalmente para mover la pala.
> No me planteo una version multijugador en mobil (Podria añadir dos sliders, pero podria ser algo engorroso)
***

## IDEAS:

* Implement Arkanoid Random "Ventajas" & Power-ups
- Aumentar velocidad de la bola
- Hacer aparecer mas bolas
- Aumentar/Disminuir el tamaño de las palas
.. Etc..
***

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
	
- Settings -->
	- The current customizable settings of the game
	- (Falta anyadirle la funcionalidad para poder cambiar los ajustes desde la pagina "frontend")

***
~ Made by sadoming ~
***
