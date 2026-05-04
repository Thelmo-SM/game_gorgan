Juego y Reglas

🎯 Objetivo

Implementar un sistema de videojuego 2D modular donde el jugador, los enemigos y el entorno interactúan correctamente a través de sistemas compartidos (como colisiones y combate), evitando dependencias directas entre módulos.

⸻

🧠 Principio clave

Los módulos pueden interactuar, pero no deben acoplarse directamente.
Toda interacción debe manejarse mediante sistemas intermedios como:
	•	Sistema de colisiones
	•	Sistema de combate
	•	Sistema de físicas

⸻

🧍 Player (Jugador)

El módulo player debe encargarse de toda la lógica del personaje controlado.

🎮 Habilidades del Player
	•	Moverse hacia la derecha (con sprite correspondiente)
	•	Moverse hacia la izquierda (con sprite correspondiente)
	•	Estar en estado idle (sprite de reposo)
	•	Realizar salto (con sprite correspondiente)
	•	Ejecutar 3 tipos de ataque (cada uno con su sprite)

🧠 Estados del Player
	•	idle
	•	run
	•	jump
	•	attack1
	•	attack2
	•	attack3

⸻

👾 Enemigos

Los enemigos estarán organizados dentro de la carpeta enemies, cada uno con su propia lógica.

🤖 Comportamiento
	•	Detectar al jugador
	•	Perseguir al jugador moviéndose:
	•	Izquierda
	•	Derecha
	•	Saltar si es necesario (siguiendo lógica del entorno)
	•	Estar en estado idle cuando no persiguen

⚔️ Combate
	•	Atacar al jugador cuando estén cerca
	•	Usar sprites correspondientes:
	•	correr
	•	idle
	•	salto
	•	ataque

⸻

⚔️ Sistema de Combate

Debe existir un sistema independiente que maneje la interacción entre player y enemigos.

Reglas:
	•	Cuando el player ataca → reduce la vida del enemigo
	•	Cuando el enemigo ataca → reduce la vida del player
	•	El daño se aplica solo si hay colisión o rango válido

⸻

🌄 Sistema de Mundo (Paisaje)

El entorno no se mueve realmente:
se debe crear la ilusión de movimiento.

🎥 Comportamiento:
	•	Cuando el player avanza → el fondo se desplaza en dirección contraria
	•	Cuando el player retrocede → el fondo se mueve en la dirección opuesta

Inspiración:
	•	Juegos tipo desplazamiento lateral como “Super Mario Bros”

⸻

🧩 Sistemas necesarios

Para lograr esto, se deben implementar módulos separados:
	•	player/ → lógica del jugador
	•	enemies/ → lógica de enemigos
	•	combat/ → manejo de daño
	•	collision/ → detección de impactos
	•	world/ → renderizado del entorno
	•	physics/ → gravedad, salto, movimiento

⸻

🚀 Enfoque de implementación
	1.	Implementar movimiento del player
	2.	Añadir estados y animaciones
	3.	Crear un enemigo básico
	4.	Implementar sistema de colisiones
	5.	Implementar sistema de combate
	6.	Añadir desplazamiento del mundo
	7.	Integrar todo en el game loop

⸻

🧠 Mentalidad

Pensar como un ingeniero de videojuegos:
	•	Separar responsabilidades correctamente
	•	Permitir interacción sin acoplamiento
	•	Diseñar sistemas reutilizables
	•	Construir de forma incremental

🛠️ Reglas de Codificación (Coding Rules)
    •   Usar ES6 Modules (import/export).
    •   No usar variables globales (window.x).
    •   Toda lógica de movimiento debe multiplicar por el Delta Time (opcional, para estabilidad de FPS).
    •   Los Assets se importan en la cabecera de cada clase/módulo.


Project Structure



├── assets/                          # Recursos estáticos
│   ├── sprites/
│   │   ├── PlayerSprite/                  # Idle, Run, Jump, Attack1-4
│   │   └── enemies/                 # Carpetas por tipo: goblin/, skeleton/
│   ├── backgrounds/                 # Capas para el Parallax (ilusión de movimiento)
│   └── sounds/                      # FX de ataques y música
│
├── src/
│   ├── js/
│   │   └── main.js                  # Entry Point: Inicializa el motor (Core)
│   
│   ├── core/                        # El "Motor" del juego
│   │   ├── game.js                  # El Game Loop (Update + Draw)
│   │   ├── renderer.js              # Limpieza de canvas y capas de dibujado
│   │   └── input.js                 # EventListeners de teclado y estado de teclas
│   
│   ├── entities/                    # Los "Actores" del juego
│   │   ├── entity.js                # CLASE PADRE: Posición, velocidad y vida base
│   │   ├── player/
│   │   │   ├── player.js            # Lógica específica del héroe
│   │   │   ├── player.states.js     # Máquina de estados (8 estados definidos)
│   │   │   └── player.config.js     # Balanceo: fuerza de salto, daño de ataques
│   │   └── enemies/
│   │       ├── enemy.js             # Clase base de IA (detección y persecución)
│   │       └── types/               # Tipos: Minion.js, Boss.js, Ranged.js
│   
│   ├── systems/                     # Las "Reglas" (Sistemas Desacoplados)
│   │   ├── physics.js               # Aplica gravedad y fricción a todas las entities
│   │   ├── collision.js             # Detecta Hitboxes (ataque) vs Hurtboxes (recibir)
│   │   ├── combat.js                # Gestiona daño, knockback y muerte
│   │   └── animationjs.             # Calcula qué frame del sprite toca dibujar
│   
│   ├── world/                       # El Escenario
│   │   ├── level.manager.js         # Carga plataformas y spawnea enemigos
│   │   ├── camera.js                # Maneja el Offset (Scroll horizontal)
│   │   └── parallax.js              # Mueve fondos a distinta velocidad que el suelo
│   
│   ├── config/                      # Ajustes Globales
│   │   ├── constants.js             # Gravedad global, FPS, escalas
│   │   └── controls.js              # Mapeo de teclas (WASD, Flechas, Espacio)
│   
│   ├── utils/                       # Herramientas de apoyo
│   │   ├── loaders.js               # Promesas para cargar imágenes antes de iniciar
│   │   └── math.js                  # Cálculos de distancias entre player y enemigos
│   └──index.html                    # Contenedor del Canvas
├── webpack.config.js                # Empaquetador de módulos
└── agent.md                         # TUS REGLAS (para que la IA no las olvide)