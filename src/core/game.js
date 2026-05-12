import { Player } from '../entities/player/player';
import { PLAYER_STATES } from '../entities/player/player.states.js';
import { Platform } from '../entities/platform/platform';
import { checkPlatformCollision } from '../systems/collision.js';
import { handleInput, keys } from './input.js';
import { Background } from '../entities/background/background.js';
import { Mountains } from '../entities/background/mountains.js';
import { Tree } from '../entities/environment/tree.js';
import { Tree_02 } from '../entities/environment/tree_02.js';
import { Grass } from '../entities/environment/grass.js';
import { Rock } from '../entities/environment/rock.js';
import { Enemy } from '../entities/enemies/enemy.js';
import { ForegroundItem } from '../entities/environment/foreground.js';
import { LaserEnemy } from '../entities/enemies/laser.enemy.js';
import { checkAttackCollision } from '../systems/combat.js';
import { MusicManager } from '../sound/music.manager.js';
import { createSounds } from '../sound/sounds.js';
import { SoundManager } from '../sound/sound.manager.js';
import { SpikeTrap } from '../entities/traps/trap-1.js';
import { PendulumTrap } from '../entities/traps/trap-2.js';
import { renderFog } from '../render/fog.renderer.js';
import { Menu } from './menu.js';
import { HealingItem } from '../entities/items/health.pickup.js';

import ground1 from '../../assets/tiles/ground_1.webp';
import ground2 from '../../assets/tiles/ground_2.webp';
import ground3 from '../../assets/tiles/ground_3.webp';

import mountainsImg from '../../assets/background/mountains_1.webp';
import mountainsFar from '../../assets/background/mountains_2.webp';
import mountainsSmall from '../../assets/background/mountains_small_1.webp';

import treeImg from '../../assets/environment/trees/tree_01.webp';
import tree_02 from '../../assets/environment/trees/tree_02.webp';
import newTreeImg from '../../assets/environment/trees/tree_03.webp';
////
import grassIMG from '../../assets/environment/grass.webp';
import rock_1 from '../../assets/environment/rocks/rock_2.webp';
import rock_S from '../../assets/environment/rocks/rock_1.webp';

import playerFace from '../../assets/sprites/player/player_face.webp';

import plantImg from '../../assets/background/plant_nearby.webp';

import tunnelImg from '../../assets/environment/tunnel-1.webp';

import floatingRock from '../../assets/environment/rocks/floating-rock.webp';

import lakeImg from '../../assets/environment/lago.webp';

import trampaImg from '../../assets/traps/trampa_1.webp';
import pendulumImage from '../../assets/traps/trampa_2.webp';

import fogImage from '../../assets/environment/nieblas.webp';

//SONIDOS
import bgMusic from '../../assets/sounds/backgroundSound.mp3';
import menuMusic from '../../assets/sounds/menuSound.mp3';

//VIDA
import healImg from '../../assets/sprites/player/health.webp';


export class Game {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.c = this.canvas.getContext('2d');

        // 📱 DETECTAR MOBILE
        this.isMobile =
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        this.background = new Background();
        this.player = new Player();
        this.playerFaceImg = new Image();
        this.playerFaceImg.src = playerFace;

        this.platforms = [];
        this.worldX = -2000;
        //this.worldX = -2000;
        //this.worldX = -7000;
        this.scrollSpeed = 5;

        this.initialized = false;

        // 🌄 Montaña grande (solo una vez)
        this.mountains = new Mountains({ image: mountainsImg });
        this.mountains.parallax = 0.2;
        this.mountains.width = 2500;
        this.mountains.height = 800;
        this.mountains.offsetY = 80;
        this.mountains.baseX = 0;
        this.mountains.repeat = false;

        //MONTAÑAS MEDIANAS
        this.farMountains = new Mountains({ image: mountainsFar });

        this.farMountains.parallax = 0.2; // 🔥 MÁS LEJOS = MÁS LENTO
        this.farMountains.width = 2000;
        this.farMountains.height = 800;
        this.farMountains.offsetY = 300; // 🔥 un poco más arriba
        this.farMountains.baseX = 1700;
        this.farMountains.repeat = false;

        // 🏔️ Montañas pequeñas
        this.smallMountains = new Mountains({ image: mountainsSmall });
        this.smallMountains.parallax = 0.4;
        this.smallMountains.width = 1700;
        this.smallMountains.height = 800;
        this.smallMountains.offsetY = 50;
        this.smallMountains.baseX = this.mountains.width;

        this.plantX = 7500;
        this.tunnelX = this.plantX + 800;

        this.lasers = [];

        //SOPNIDOS
        this.audioUnlocked = false;
        this.music = new MusicManager();

        this.menuMusicStarted = false;

        //PASOS DEL PLAYER
        this.sounds = createSounds();
        this.soundManager = new SoundManager(this.sounds);
        //CONEXIÒN DE SONIDO DE PASOS CON EL PLAYER
        this.player.onStep = () => {
        this.soundManager.playStep();
        };
        //ATAQUE DE PLAYER SONIDO
        this.player.onAttack = () => {
        this.soundManager.playAttack();
        };
        //SALTO DEL PLAYER SONIDO
        this.player.onJump = () => {
        this.soundManager.playJump();
        };
        //MUERTE DEL PLAYER SONIDO
        this.player.onDeath = () => {
        this.soundManager.playDeath();
        };
        // 💀 GAME OVER FADE
        this.deathOpacity = 0;
        this.isRestarting = false;
        this.deathStartTime = 0;

        //LAGO
        this.waveOffset = 0;
        //ROCAS PARA EL LAGO

        //TRAMPAS
        this.traps = [];
        this.pendulums = [];

        //NIEBLAS
        this.fogImage = new Image();
        this.fogImage.src = fogImage;

        //MENU
        this.gameState = 'MENU';

        //VIDA
// ❤️ OBJETOS CURATIVOS
this.healingItems = [];

this.healImage = new Image();
this.healImage.src = healImg;

this.healingItems.push(

new HealingItem({
    x: 12200,
    y: 500,
    image: this.healImage
}),

    new HealingItem({
        x: 17000,
        y: 500,
        image: this.healImage
    }),
        new HealingItem({
        x: 19000,
        y: 500,
        image: this.healImage
    }),
            new HealingItem({
        x: 20000,
        y: 500,
        image: this.healImage
    }),

    new HealingItem({
        x: 22000,
        y: 500,
        image: this.healImage
    })

);
        
    }

    init() {


//TAMAÑO DE PANTALLAS
this.baseWidth = 1920;
this.baseHeight = 1080;

this.canvas.width = this.baseWidth;
this.canvas.height = this.baseHeight;

    //MENU DEL JUEGO
this.menu = new Menu({
    canvas: this.canvas,
    c: this.c,
    onSelect: (option) => {
        if (option === 'INICIAR JUEGO') {

        this.music.stop();

        // 🔥 desbloquear sonidos
        this.soundManager.unlock();

        // 🔥 AQUÍ VA EL BACKGROUND SOUND startMenuMusi
        this.music.play(bgMusic, 0.4);

            this.gameState = 'PLAYING';
        }

        if (option === 'OPCIONES') {
            console.log('Opciones');
        }

        if (option === 'CREDITOS') {
            console.log('Creditos');
        }
    }
});

// const startMenuMusic = () => {

//     this.soundManager.unlock();

//     this.music.play(menuMusic, 0.3);

//     window.removeEventListener('keydown', startMenuMusic);
//     window.removeEventListener('click', startMenuMusic);
// };

    if (!this.initialized) {

        const startMenuMusic = () => {

            this.soundManager.unlock();

            this.music.play(menuMusic, 0.3);

            window.removeEventListener('keydown', startMenuMusic);
            window.removeEventListener('click', startMenuMusic);
        };

        window.addEventListener('keydown', startMenuMusic);
        window.addEventListener('click', startMenuMusic);

        handleInput(this.player);

        this.initialized = true;
    }

        //handleInput(this.player);

       this.TILE = 400;
       this.groundY = this.canvas.height - this.TILE;
        const grounds = [ground1, ground2, ground3];

        // 🟫 SUELO INFINITO   enemy.update(this.c, this.groundY, this.worldX);
        this.platforms = [];

        for (let i = 0; i < 20; i++) {
            this.platforms.push(
                new Platform({
                    x: i * this.TILE,
                    y: this.groundY,
                    image: grounds[i % grounds.length]
                })
            );
        }

        //ENEMIES
        this.enemies = [];

const enemyHeight = 200;
const plantX = 7500;
        this.tunnelX = this.plantX + 1200;



this.enemies.push(
    new Enemy({
        x: plantX + 1700,
        y: this.groundY,
        type: 'TANK',
        soundManager: this.soundManager
    }),

    new Enemy({
        x: plantX + 4220,
        y: this.groundY,
        type: 'SLIME',
        soundManager: this.soundManager
    }),
        new Enemy({
        x: plantX + 8000,
        y: this.groundY,
        type: 'FAST',
        soundManager: this.soundManager
    }),
        new Enemy({
        x: plantX + 15000,
        y: this.groundY,
        type: 'FAST',
        soundManager: this.soundManager
    }),
        new Enemy({
        x: plantX + 19000,
        y: this.groundY,
        type: 'FAST',
        soundManager: this.soundManager
    }),
        new Enemy({
        x: plantX + 21000,
        y: this.groundY,
        type: 'FAST',
        soundManager: this.soundManager
    })
);

//NUEVO ENEMIGO hit
const floatingX = 18000;

this.enemies.push(
    new LaserEnemy({
        x: floatingX,
        y: this.groundY,
        lasers: this.lasers,
        soundManager: this.soundManager
    })
);

this.enemies.push(
   new Enemy({ x: 800, y: this.groundY, type: 'SLIME' }),
   // new Enemy({ x: 1200, y: this.groundY, type: 'FAST' }),
   //new Enemy({ x: plantX - 100, y: this.groundY, type: 'TANK' }),
   
);
// if (!this.enemySpawned && this.player.position.x > 500) {
//     this.enemies.push(
//         new Enemy({ x: this.worldX * -1 + 1000, y: this.groundY, type: 'TANK' }) audioUnlocked
//     );

//     this.enemySpawned = true;
// }

        // 🌍 BASE DEL MUNDO
        const startX = this.mountains.width + this.smallMountains.width;

        // 🌲 ÁRBOLES PEQUEÑOS
        this.smallTrees = [];
        const TREE_SPACING = 80;

        for (let i = 0; i < 80; i++) {
            const tree = new Tree({
                x: startX + i * TREE_SPACING,
                y: this.groundY - 350,
                image: treeImg
            });

            tree.width = 250;
            tree.height = 450;

            this.smallTrees.push(tree);
        }

        // 🌳 ÁRBOLES GRANDES (solo 3) y: this.canvas.height 1090
        this.tree_02_List = [];
        const TREE_02_SPACING = 2500;
        const TREE_02_COUNT = 3;

        for (let i = 0; i < TREE_02_COUNT; i++) {
            this.tree_02_List.push(
                new Tree_02({
                    x: startX + i * TREE_02_SPACING + 800,
                    y: this.groundY - 240,
                    image: tree_02
                })
            );
        }

        // 🧠 FIN DE ÁRBOLES GRANDES
        const endOfBigTrees = startX + (TREE_02_SPACING * TREE_02_COUNT);

        // 🪨 ROCAS GRANDES (solo 2) 420
        this.bigRocks = [];
        const ROCK_SPACING = 9400;

        for (let i = 0; i < 2; i++) {
            const rock = new Rock({
                x: endOfBigTrees + 800 + i * ROCK_SPACING,
                y: this.groundY - 690,
                image: rock_1
            });

            rock.width = 900;
            rock.height = 900;

            this.bigRocks.push(rock);
        }

        // 🌿 GRASS (como suelo) barWidth = 300
        this.grass = [];

        for (let i = 0; i < 60; i++) {
            this.grass.push(
                new Grass({
                    x: i * this.TILE,
                    y: this.groundY - 20,
                    image: grassIMG
                })
            );
        }

        //objetos cercanos y accesorios
        this.foregroundItems = [];

this.foregroundItems.push(
    new ForegroundItem({
        x: plantX, // un poco a la derecha
        y: -50,  // 🔥 FUERZA visible arriba 260
        image: plantImg,
        width: 800,
        height: 800
    })
);  

this.tunnel = new ForegroundItem({
    x: this.tunnelX,
    y: this.groundY - 280,
    image: tunnelImg,
    width: 800,
    height: 400,
    parallax: 1.3
});

//plataforma flotante
this.floatingPlatforms = [];

this.floatingPlatforms.push(
    new Platform({
        x: 18000,
        y: this.groundY - 400,
        image: floatingRock,

        collisionOffsetX: 120,   // 🔥 recorta lados
        collisionWidth: 160,     // 🔥 más estrecha

        collisionOffsetY: 30,
        collisionHeight: 40      // 🔥 solo la parte superior
    }),
        new Platform({
        x: 36800,
        y: this.groundY - 400,
        image: floatingRock,

        collisionOffsetX: 120,   // 🔥 recorta lados
        collisionWidth: 160,     // 🔥 más estrecha

        collisionOffsetY: 30,
        collisionHeight: 40      // 🔥 solo la parte superior
    })
);

//LAGO
this.lakeX = 33000; // 👈 IMPORTANTE (positivo)
this.lakeParallax = 0.6;
        this.lake = new ForegroundItem({
            x: this.lakeX,
            y: this.groundY - 90, // Ajustado para que se vea sobre el suelo
            image: lakeImg,
            width: 1200,           // MUCHO MÁS ANCHO
            height: 210,           // MÁS ALTO
            parallax: this.lakeParallax
        });
// 🏔️ MONTAÑA PEQUEÑA SOLO EN EL LAGO
this.lakeMountain = new ForegroundItem({
    x: this.lakeX - 170,
    y: this.groundY - 590,
    image: mountainsSmall,
    width: 1350,
    height: 1000,
    parallax: this.lakeParallax
});

//ARBOL 3
this.specialTree = new ForegroundItem({
    x: 33950,
    y: this.groundY - 600,
    image: newTreeImg,
    width: 700,
    height: 700,
    parallax: this.lakeParallax
});
// 🌳 ÁRBOL ÚNICO EN EL LAGO
this.lakeTree = new ForegroundItem({
    x: this.lakeX + 300, // ajusta izquierda/derecha
    y: this.groundY - 330, // altura sobre el suelo  y: this.canvas.height - 750
    image: treeImg,
    width: 400,
    height: 400,
    parallax: this.lakeParallax // 🔥 mismo que el lago
});

//ROCAS EN EL LAGO
// 🪨 ROCAS CERCA DEL LAGO (MISMA CAPA VISUAL)
this.foregroundItems.push(
    new ForegroundItem({
        x: 34600, // izquierda del lago
        y: this.groundY - 160,
        image: rock_S,
        width: 300,
        height: 300,
        parallax: this.lakeParallax
    }),
    new ForegroundItem({
        // Una segunda roca un poco más a la derecha y más pequeña para variar
        x: 32500, 
        y: this.groundY - 200,
        image: rock_S,
        width: 450,
        height: 350,
        parallax: this.lakeParallax
    })
);

//TRAMPAS PARA EL JUEGO
this.traps = [];
const trampa_1_asset = new Image();
trampa_1_asset.src = trampaImg;

this.traps.push(
    new SpikeTrap({
        x: 35500,
        y: this.groundY - 470,
        image: trampa_1_asset
    })
);

const pendulumAsset = new Image(); 

// 2. IMPORTANTE: Asignar el src de la imagen importada 750
pendulumAsset.src = pendulumImage; 

// 3. Pasar el asset ya configurado al PendulumTrap
this.pendulums.push(new PendulumTrap({
    x: 37000,
    y: 0,
    image: pendulumAsset, 
    length: 300
}));

//MOBILE
if (this.isMobile) {
    this.createMobileControls();
}



    }

    start() {
        this.animate();
    }





    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //MENU DEL JUEGO
    // ✅ MENU
if (this.gameState === 'MENU') {

    // 🔥 MÚSICA DEL MENÚ
    // if (!this.menuMusicStarted) {
    //     this.music.play(menuMusic, 0.3);
    //     this.menuMusicStarted = true; movimiento
    // }

    this.menu.update(keys);
    this.menu.draw();
    return;
}

if (this.gameState === 'PLAYING' && this.player.position.x - this.worldX >= 39000) {
    this.music.stop();
    this.gameState = 'END';
}
// ✅ END GAME
if (this.gameState === 'END') {
    this.drawEndScreen();
    this.handleEndInput(keys);
    return;
}



        //MOVIMIENTO DEL AGUA DEL LAGO gameState 
        this.waveOffset += 0.02;

    const player = this.player;

    const LEFT_LIMIT = this.canvas.width * 0.20;
    const RIGHT_LIMIT = this.canvas.width * 0.40;

// 🎮 MOVIMIENTO
if (!player.isDead) {

    if (keys.right.pressed) {
        player.direction = 'right';

        if (player.position.x < RIGHT_LIMIT) {
            player.position.x += 4;
        } else {
            this.worldX -= this.scrollSpeed;
        }
    } 
    else if (keys.left.pressed) {

        player.direction = 'left';

        if (player.position.x > LEFT_LIMIT) {
            player.position.x -= 4;
        } else {
            this.worldX += this.scrollSpeed;
        }
    }

}

    // 🌌 FONDO
// 🌌 FONDO (MUY LEJANO)
this.background.draw(this.c, this.worldX * 0.1);

// 🏔️ MONTAÑAS LEJANAS
this.mountains.draw(this.c, this.worldX * 0.4);

this.farMountains.draw(this.c, this.worldX);

// ⛰️ MONTAÑAS MEDIAS { once: true } 



// 🌳 ENTORNO
// 🌳 ÁRBOLES GRANDES (medio-lejos)
this.tree_02_List.forEach(tree => tree.draw(this.c, this.worldX * 0.7));

// 🌲 ÁRBOLES PEQUEÑOS (más cerca)
this.smallTrees.forEach(tree => tree.draw(this.c, this.worldX * 0.85));

// 🪨 ROCAS (casi en gameplay)
this.bigRocks.forEach(rock => rock.draw(this.c, this.worldX * 0.95));

if (this.specialTree) {
    this.specialTree.draw(this.c, this.worldX);
}
if (this.lakeTree) {
    this.lakeTree.draw(this.c, this.worldX);
}




    // 🟫 SUELO foregroundItems 640
    const TILE = 400;

    this.platforms.forEach(platform => {
        const drawX = platform.position.x + this.worldX;

        this.c.drawImage(
            platform.image,
            drawX,
            platform.position.y,
            platform.width,
            platform.height
        );

        const platformForPlayer = {
            ...platform,
            position: { x: drawX, y: platform.position.y }
        };

        checkPlatformCollision(player, platformForPlayer);

        this.enemies.forEach(enemy => {
            if (enemy.hitbox) {
                checkPlatformCollision(enemy, platform);
            }
        });

        if (drawX + TILE < 0) {
            platform.position.x += TILE * this.platforms.length;
        }

        if (drawX > this.canvas.width) {
            platform.position.x -= TILE * this.platforms.length;
        }
    });

    // 🪨 PLATAFORMAS FLOTANTES
    this.floatingPlatforms.forEach(platform => {
        const drawX = platform.position.x + this.worldX;

        this.c.drawImage(
            platform.image,
            drawX,
            platform.position.y,
            platform.width,
            platform.height
        );

        const platformForPlayer = {
            ...platform,
            position: { x: drawX, y: platform.position.y }
        };

        checkPlatformCollision(player, platformForPlayer);
    });

// --- RENDERIZADO DEL LAGO SINCRONIZADO ---

// Calculamos cuánto se ha desplazado el fondo
const parallaxOffset = this.worldX * 0.6; 

// Dibujamos la montaña de fondo
this.lakeMountain.draw(this.c, this.worldX);
// Dibujamos el árbol al frente
this.lakeTree.draw(this.c, this.worldX);


// Dibujamos el agua (ajustando la posición base para que sea visible en -33000)
// Sumamos 19800 para compensar el inicio en -33000 con parallax 0.6
const lakeX = (this.lake.position.x - 13200) + parallaxOffset;
const lakeY = this.lake.position.y;

for (let i = 0; i < 5; i++) {
    const wave = Math.sin(this.waveOffset + i * 0.5) * 5;
    this.c.drawImage(
        this.lake.image,
        lakeX,
        lakeY + wave,
        this.lake.width,
        this.lake.height
    );
}
//ROCAS EN EL LAGO
this.foregroundItems.forEach(item => {

    const screenX = item.position.x + this.worldX;

    // 👇 solo dibuja si está cerca de la cámara
    if (screenX > -1500 && screenX < this.canvas.width + 1500) {
        item.draw(this.c, this.worldX);
    }

});



    // 🧍 PLAYER
    player.update(this.c, this.canvas.height, keys);

    // 💀 REINICIO POR MUERTE
if (player.isDead && !this.isRestarting) {

    this.isRestarting = true;

setTimeout(() => {

    this.respawnPlayer();

    this.deathOpacity = 0;
    this.isRestarting = false;

}, 6000);
}

    // ❤️ OBJETOS CURATIVOS
this.healingItems.forEach(item => {

    const itemX = item.position.x + this.worldX;
    const itemY = item.position.y;

    const hit =
        player.position.x < itemX + item.width &&
        player.position.x + player.width > itemX &&
        player.position.y < itemY + item.height &&
        player.position.y + player.height > itemY;

    if (hit && !item.collected && player.hp < 100) {

        player.hp = Math.min(player.hp + 20, 100);

        item.collected = true;

        this.soundManager.playHeal();
    }

    item.draw(this.c, this.worldX);

});
    // DEBUG PLAYER HITBOX
// this.c.strokeStyle = 'blue';
// this.c.strokeRect(player.position.x, player.position.y, player.width, player.height);

//NIEBLAS
renderFog(this.c, this);

    //trampas para el juego
this.traps.forEach(trap => {
    // --- LÓGICA DE VOLUMEN DINÁMICO ---
    // Calculamos la distancia horizontal entre el player y la trampa
    // Usamos el centro de la trampa para mayor precisión
    const trapCenterX = trap.position.x + this.worldX + (trap.width / 2);
    const playerCenterX = player.position.x + (player.width / 2);
    
    const distance = Math.abs(trapCenterX - playerCenterX);
    const maxDistance = 2000; // Radio de audición en píxeles
    
    // Calculamos el volumen: 1 en el centro, 0 a los 1000px
    let dynamicVolume = 1 - (distance / maxDistance);
    if (dynamicVolume < 0) dynamicVolume = 0;

    // Pasamos el volumen al update de la trampa
    trap.update(this.c, this.worldX, () => {
        this.soundManager.playTrapSpatial(dynamicVolume);
    });

    // --- RESTO DE TU LÓGICA DE COLISIÓN (IGUAL QUE ANTES) ---
    const trapHitboxX = trap.position.x + this.worldX + trap.hitbox.offsetX;
    const trapHitboxY = trap.position.y + (trap.height - trap.hitbox.height);

    if (!player.isDead && 
        player.position.x < trapHitboxX + trap.hitbox.width &&
        player.position.x + player.width > trapHitboxX &&
        player.position.y < trapHitboxY + trap.hitbox.height &&
        player.position.y + player.height > trapHitboxY
    ) {
        if (trap.isDangerous) {
            player.hp = 0;
            if (typeof this.player.onDeath === 'function') this.player.onDeath();
            player.die();
        }
    }
});

//TRAMPA 2
this.pendulums.forEach(pendulum => {

    pendulum.update();

    //SONIDO
    this.soundManager.updatePendulumSound(
    pendulum,
    this.player,
    this.worldX
);

    // 🔥 PRIMERO DIBUJAS (esto es clave)
    pendulum.draw(this.c, this.worldX);

    if (!player.isDead && pendulum.screenHammerPos) {

        const offsets = [300, 250, 200];

        offsets.forEach(offset => {

            const tipX = pendulum.screenHammerPos.x 
                + Math.sin(pendulum.angle) * offset;

            const tipY = pendulum.screenHammerPos.y 
                + Math.cos(pendulum.angle) * offset;

            const dx = (player.position.x + player.width / 2) - tipX;
            const dy = (player.position.y + player.height / 2) - tipY;

            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < 150) {
                player.hp = 0;
                player.die();
            }

            // 🔴 DEBUG (AHORA SÍ SE VA A VER)
           // this.c.fillStyle = 'red';
           // this.c.fillRect(tipX - 4, tipY - 4, 8, 8); (hit && !item.collected && player.hp < 100)
        });
    }
});

        // =========================
    // 🔥 LASERS (INDEPENDIENTE)
    // =========================
// 🔥 LASERS (FUERA DEL LOOP DE ENEMIGOS)
// =========================
// 🔥 LASERS (DETRÁS DEL ENEMIGO)
// =========================
this.lasers.forEach((laser, index) => {

    laser.update(this.c, this.worldX);

    // 🔥 eliminar por duración
    if (laser.duration <= 0) {
        this.lasers.splice(index, 1);
        return;
    }

    const laserX = laser.position.x + this.worldX;
    const laserY = laser.position.y;

    // 🔥 CORREGIDO (izquierda/derecha)
    const laserStart = laser.direction === 'right'
        ? laserX
        : laserX - laser.length;

    const laserEnd = laser.direction === 'right'
        ? laserX + laser.length
        : laserX;

    const hit =
        laserEnd > player.position.x &&
        laserStart < player.position.x + player.width &&
        laserY < player.position.y + player.height &&
        laserY + laser.height > player.position.y;
if (hit) {
    player.takeHit(20);

    // 🔥 CLAMP (OBLIGATORIO)
    if (this.player.hp < 0) {
        this.player.hp = 0;
    }
}
  
});

    // =========================
    // 🔥 ENEMIGOS (INDEPENDIENTE)
    // =========================
this.enemies.forEach(enemy => {

    const screenX = enemy.position.x + this.worldX;

    const isVisible =
        screenX > -500 &&
        screenX < this.canvas.width + 500;

    if (isVisible) {

        enemy.update(this.c, this.worldX, player);

    } else {

        // 🔥 DETENER SUSURRO SI SALE DE PANTALLA
        if (enemy.whisperSound) {

            enemy.whisperSound.pause();
            enemy.whisperSound.currentTime = 0;
        }
    }
});
//TUNEL
if (this.tunnel) {
    this.tunnel.draw(this.c, this.worldX);
}

// =========================
// ⚔️ ATAQUE DEL PLAYER
// =========================
const isAttacking =
    player.state === PLAYER_STATES.ATTACK_1 ||
    player.state === PLAYER_STATES.ATTACK_2 ||
    player.state === PLAYER_STATES.ATTACK_3;

if (isAttacking) {
    this.enemies.forEach(enemy => {

        if (enemy.isDead) return;

const attackX = player.direction === 'right'
    ? player.position.x + player.attackBox.offsetX
    : player.position.x - player.attackBox.width - player.attackBox.offsetX;

        const attackY = player.position.y + player.attackBox.offsetY;

const enemyX = enemy.position.x + this.worldX + (enemy.hitbox?.offsetX || 0);
const enemyY = enemy.position.y + (enemy.hitbox?.offsetY || 0);

const enemyWidth = enemy.hitbox?.width || enemy.width;
const enemyHeight = enemy.hitbox?.height || enemy.height;

const hit =
    attackX < enemyX + enemyWidth &&
    attackX + player.attackBox.width > enemyX &&
    attackY < enemyY + enemyHeight &&
    attackY + player.attackBox.height > enemyY;

        const isHitFrame =
            player.frames >= 3 && player.frames <= 5;

        if (hit && !player.hasHit && isHitFrame) {

            if (typeof enemy.takeHit === 'function') {
                enemy.takeHit(10);
            }

            player.hasHit = true;
        }
//VIDA

       // this.c.strokeStyle = 'blue'; 
// this.c.strokeRect(
//     player.position.x,
//     player.position.y,
//     player.width,
//     player.height
// );

//         // 🧪 DEBUG
//         this.c.strokeStyle = 'yellow';
//         this.c.strokeRect(
//             attackX,
//             attackY,
//             player.attackBox.width,
//             player.attackBox.height
//         );

// this.c.strokeStyle = 'red';
// this.c.strokeRect(
//     enemyX,
//     enemyY,
//     enemyWidth,
//     enemyHeight
// );
    });
}


    // 🌿 FOREGROUND
// this.foregroundItems.forEach(item => { if (hit && !player.hasHit && isHitFrame)
//     item.draw(this.c, this.worldX * 1.2);
// });


    // 🌱 GRASS
    this.grass.forEach(grass => {
        const drawX = grass.position.x + this.worldX;

        this.c.drawImage(
            grass.image,
            drawX,
            grass.position.y,
            grass.width,
            grass.height
        );

        if (drawX + TILE < 0) {
            grass.position.x += TILE * this.grass.length;
        }

        if (drawX > this.canvas.width) {
            grass.position.x -= TILE * this.grass.length;
        }
    });

    // ❤️ VIDA 
    const maxHP = 100;
    const hp = player.hp;

const scaleX = this.canvas.width / 1920;
const scaleY = this.canvas.height / 1080;

const barWidth = 300 * scaleX;
const barHeight = 15 * scaleY;

const x = 120 * scaleX;
const y = 60 * scaleY;

const faceSize = 50 * scaleX;

this.c.drawImage(
    this.playerFaceImg,
    70 * scaleX,
    30 * scaleY,
    faceSize,
    faceSize
);

    this.c.fillStyle = 'gray';
    this.c.fillRect(x - 1, y - 1, barWidth + 1, barHeight + 1);

    this.c.fillStyle = 'black';
    this.c.fillRect(x, y, (hp / maxHP) * barWidth, barHeight);

    this.c.strokeStyle = 'gray';
    this.c.strokeRect(x, y, barWidth, barHeight);
    
// 💀 FADE DE MUERTE
if (player.isDead) {

    const elapsed = Date.now() - player.deathStartTime;

    // 🔥 esperar antes de oscurecer
    if (elapsed > 4200) {

        this.deathOpacity += 0.008;

        if (this.deathOpacity > 1) {
            this.deathOpacity = 1;
        }

        this.c.fillStyle = `rgba(0,0,0,${this.deathOpacity})`;

        this.c.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }
}
}

drawEndScreen() {

    const c = this.c;

    const scaleX = this.canvas.width / 1920;
    const scaleY = this.canvas.height / 1080;

    c.fillStyle = 'rgba(0,0,0,0.8)';
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);

    c.textAlign = 'center';
    c.textBaseline = 'middle';

    c.font = `${80 * scaleX}px GameFont`;
    c.fillStyle = 'white';

    c.fillText(
        'FIN DE LA DEMO',
        this.canvas.width / 2,
        this.canvas.height / 2 - (80 * scaleY)
    );

    c.font = `${30 * scaleX}px GameFont`;

    c.fillText(
        'Gracias por jugar',
        this.canvas.width / 2,
        this.canvas.height / 2
    );

    c.font = `${25 * scaleX}px GameFont`;

    c.fillStyle = 'gray';

    c.fillText(
        'Presiona ENTER para volver al menú',
        this.canvas.width / 2,
        this.canvas.height / 2 + (80 * scaleY)
    );
}

handleEndInput(keys) {
    if (keys.enter?.pressed) {

        this.music.stop();
        this.soundManager.stopAll();

        // 🔥 RESET REAL
        this.resetGame();

        // 🔥 VOLVER AL MENU
        this.gameState = 'MENU';

        this.music.play(menuMusic, 0.3);

        keys.enter.pressed = false;
    }
}

resetGame() {

    this.init();

    this.worldX = -2000;

    this.player.position.x = 100;
    this.player.position.y = 0;

    this.player.velocity.x = 0;
    this.player.velocity.y = 0;

    this.player.hp = 100;

    this.player.isDead = false;

    this.player.state = PLAYER_STATES.IDLE;
}

respawnPlayer() {

    // 🔥 RECREAR TODO EL MUNDO
    this.init();

    this.worldX = -2000;

    this.player.position.x = 100;
    this.player.position.y = 0;

    this.player.velocity.x = 0;
    this.player.velocity.y = 0;

    this.player.hp = 100;

    this.player.isDead = false;

    this.player.frames = 0;
    this.player.frameTimer = 0;

    this.player.state = PLAYER_STATES.IDLE;
}

//Control para mobile handleInput(this.player);
createMobileControls() {

    // 🔥 evitar duplicados
    if (document.getElementById('mobile-controls')) return;

    const controls = document.createElement('div');

    controls.innerHTML = `
<div id="mobile-controls">
    <button id="left-btn">◀</button>
    <button id="right-btn">▶</button>
    <button id="jump-btn">⬆</button>
    <button id="attack-btn">⚔</button>
    <button id="enter-btn">⏎</button>
</div>
    `;

    document.body.appendChild(controls);

    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const jumpBtn = document.getElementById('jump-btn');
    const attackBtn = document.getElementById('attack-btn');

    // 🔥 LEFT
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys.left.pressed = true;
    });

    leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys.left.pressed = false;
    });

    // 🔥 RIGHT
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys.right.pressed = true;
    });

    rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys.right.pressed = false;
    });

    // 🔥 JUMP
    jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();

        if (!keys.jump.pressed) {
            this.player.jump();
            keys.jump.pressed = true;
        }
    });

    jumpBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys.jump.pressed = false;
    });

    // 🔥 ATTACK
    attackBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();

        this.player.onAttackInput();
        keys.attack1.pressed = true;
    });

    attackBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys.attack1.pressed = false;
    });

    const enterBtn = document.getElementById('enter-btn');

    enterBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();

    keys.enter.pressed = true;
});

enterBtn.addEventListener('touchend', (e) => {
    e.preventDefault();

    keys.enter.pressed = false;
});
}

}



