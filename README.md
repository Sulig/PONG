# PONG

~ Started on: 11/12/2025 ~ *** ~ Ended on: IN PROGRESS

> [!WARNING]\
> This repository is IN PROGRESS
> See `Backlog PONG` to see what i'm doing.

## Rules
Demo of the classic PONG game.
+ La pelota rebota en las palas
+ En la primera instancia, se decide aleatoriamente hacia donde se dirigira la bola (si J1 o J2)
+ Cuando un jugador marque, se le asignara un punto y la bola se sacara desde el jugador que ha perdido.
+ El juego termina cuando alguien haya ganado X puntos.

### Game customizatation
Por ahora, aunque no se puede cambiar los ajustes, esto es lo que podrias customizar:
- Seleccionar cuantos puntos se necesitan para ganar una partida.
- Seleccionar si se jugara 1 vs 1 (offline)
- Seleccionar si se jugara 1 vs AI
- Seleccionar que lado de la pantalla controlas
- Seleccionar la dificultad de la AI

## Controlles
+ 'w' y 's'				-> Controla la pala izquierda
+ Arrow up & Arrow down	-> Controla la pala derecha

> Puedes decidir que lado controlar si juegas contra la AI
>> (-- el jugador puede decidir que tecla usar, solo que eso no esta implementado en el frontend)
>> Puedes customizar que jugador puede utilizar el raton |(si se quiere usar el raton)

!En mobil ->
- Aparecen sliders dependiendo de cuantas personas van a jugar o que lado prefieres jugar.
-> Por ejemplo:
	-- Barra manejable izquierda si eliges la pala izquierda
	-- Barra manejable derecha si eliges la pala derecha
	-- Las dos Barras si es un 1 vs 1
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
	- All the Event Listeners (included key-input down\up)
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
