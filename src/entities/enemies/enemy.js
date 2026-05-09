import { gravity } from '../../utils/game';
import { ENEMY_TYPES } from './types/enemy.types.js';
import { ENEMY_STATES } from './enemy.states.js';

import idleLeft from '../../../assets/sprites/enemies/jb/idle_left.png';
import idleRight from '../../../assets/sprites/enemies/jb/idle_right.png';

import runLeft from '../../../assets/sprites/enemies/jb/run_left.png';
import runRight from '../../../assets/sprites/enemies/jb/run_right.png';

import attackLeft from '../../../assets/sprites/enemies/jb/attack_left.png';
import attackRight from '../../../assets/sprites/enemies/jb/attack_right.png';

import deadLeft from '../../../assets/sprites/enemies/jb/dead_left.png';
import deadRight from '../../../assets/sprites/enemies/jb/dead_right.png';

export class Enemy {
constructor({ x, y, type, soundManager }) {
    const config = ENEMY_TYPES[type];

    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };

    this.width = config.width;
    this.height = config.height;

    this.scale = 1;
    this.visualOffsetY = 140;

    this.isOnGround = false;

    this.hitbox = {
        offsetY: -80,
        height: 80
    };

    this.state = ENEMY_STATES.IDLE;
    this.direction = 'left';

    // ATAQUE
    this.attackCooldown = 0;
    this.attackDelay = 60;
    this.attackDamage = 10;
    this.attackFrame = 0;
    this.attackDuration = 30;
    this.hasHit = false;

    // VIDA
    this.hp = 50;
    this.isDead = false;
    this.isHit = false;

    // ANIMACIÓN
    this.frames = 0;
    this.frameTimer = 0;

    // 🔥 CONTROL DE CARGA
    this.imagesToLoad = 8;
    this.imagesLoaded = 0;

    //SONIDO
    this.soundManager = soundManager; // 🔥 GUARDARLO
    // control del susurro
    this.whisperSound = null;
    this.stepTimer = 0;
    this.stepDelay = 35; // 🔥 ajusta esto

const markLoaded = () => {
    this.imagesLoaded++;

    if (this.imagesLoaded === this.imagesToLoad) {
        this.loaded = true;
    }
};

    this.sprites = {
        idle: {
            left: new Image(),
            right: new Image(),
            maxFrames: 20
        },
        run: {
            left: new Image(),
            right: new Image(),
            maxFrames: 36
        },
        attack: {
            left: new Image(),
            right: new Image(),
            maxFrames: 25
        },
        dead: {
            left: new Image(),
            right: new Image(),
            maxFrames: 24
        }
    };

    // CARGA SPRITES
    this.sprites.idle.left.src = idleLeft;
    this.sprites.idle.right.src = idleRight;

    this.sprites.run.left.src = runLeft;
    this.sprites.run.right.src = runRight;

    this.sprites.attack.left.src = attackLeft;
    this.sprites.attack.right.src = attackRight;

    this.sprites.dead.left.src = deadLeft;
    this.sprites.dead.right.src = deadRight;

    // 🔥 EVENTOS DE CARGA (CLAVE)
    this.sprites.idle.left.onload = markLoaded;
    this.sprites.idle.right.onload = markLoaded;
    this.sprites.run.left.onload = markLoaded;
    this.sprites.run.right.onload = markLoaded;
    this.sprites.attack.left.onload = markLoaded;
    this.sprites.attack.right.onload = markLoaded;
    this.sprites.dead.left.onload = markLoaded;
    this.sprites.dead.right.onload = markLoaded;
}

draw(context, worldX) {
    let spriteConfig = this.sprites.idle;

    // 🔥 PRIORIDAD
    if (this.isDead) {
        spriteConfig = this.sprites.dead;
    } else if (this.state === ENEMY_STATES.CHASE) {
        spriteConfig = this.sprites.run;
    } else if (this.state === ENEMY_STATES.ATTACK) {
        spriteConfig = this.sprites.attack;
    }

    const sprite = this.direction === 'left'
        ? spriteConfig.left
        : spriteConfig.right;

if (!this.loaded) {
    context.fillStyle = 'purple';
    context.fillRect(
        this.position.x + worldX,
        this.position.y,
        this.width,
        this.height
    );
    return;
}


// context.strokeStyle = 'red';
// context.strokeRect(
//     this.position.x + worldX,
//     this.position.y,
//     this.width,
//     this.height
// );

    const cropWidth = sprite.width / spriteConfig.maxFrames;
    const cropHeight = sprite.height;

    // 🔥 ANIMACIÓN
    if (!this.isDead) {
        let speed = 4;
        if (this.state === ENEMY_STATES.CHASE) speed = 3;

        this.frameTimer++;
        if (this.frameTimer >= speed) {
            this.frames = (this.frames + 1) % spriteConfig.maxFrames;
            this.frameTimer = 0;
        }
    } else {
        // 💀 se queda en último frame
        this.frames = spriteConfig.maxFrames - 1;
    }

    const renderWidth = cropWidth * this.scale;
    const renderHeight = cropHeight * this.scale;

    const offsetX = (renderWidth - this.width) / 2;

    const drawX = this.position.x + worldX - offsetX;
    const drawY = this.position.y - renderHeight + this.visualOffsetY;

    context.save();

        if (this.isHit) {
    context.globalAlpha = 0.3;
    context.filter = 'brightness(2)';
}

    // 🔥 FLIP REAL
    if (this.direction === 'left') {
        context.drawImage(
            sprite,
            cropWidth * this.frames,
            0,
            cropWidth,
            cropHeight,
            drawX,
            drawY,
            renderWidth,
            renderHeight
        );
    } else {
        context.scale(-1, 1);
        context.drawImage(
            sprite,
            cropWidth * this.frames,
            0,
            cropWidth,
            cropHeight,
            -drawX - renderWidth,
            drawY,
            renderWidth,
            renderHeight
        );
    }

    context.restore();

    // 🔴 HITBOX DEBUG
    // context.strokeStyle = 'red';
    // context.strokeRect(
    //     this.position.x + worldX,
    //     this.position.y + this.hitbox.offsetY,
    //     this.width,
    //     this.hitbox.height
    // );

    // ❤️ VIDA ENCIMA
    if (!this.isDead) {
        const barWidth = this.width;
        const barHeight = 6;

        const barX = this.position.x + worldX;
        const barY = this.position.y - 180;
const maxHP = this.maxHP || 50; // 🔥 fallback seguro
const hp = Math.max(this.hp, 0); // evita negativos

context.fillStyle = 'black';
context.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

context.fillStyle = 'red';
context.fillRect(
    barX,
    barY,
    (hp / maxHP) * barWidth,
    barHeight
);

    }
}

update(context, worldX, player) {
    if (!this.isDead) {
        this.handleState(player, worldX);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // 🔥 SOLO gravedad si NO está en el suelo
if (!this.isOnGround) {
    this.velocity.y += gravity;
} else {
    this.velocity.y = 0;
}

this.isOnGround = false;

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }

    this.draw(context, worldX);
}

   handleState(player, worldX) {
    const enemyX = this.position.x + worldX;
    const playerX = player.position.x;

    const distance = playerX - enemyX;
    const absDistance = Math.abs(distance);

    const attackRange = 200;
    const chaseRange = 900;

    // 🔥 DECISIÓN DE ESTADO
    if (absDistance < attackRange) {
        this.state = ENEMY_STATES.ATTACK;
    } else if (absDistance < chaseRange) {
        this.state = ENEMY_STATES.CHASE;
    } else {
        this.state = ENEMY_STATES.IDLE;
    }

    switch (this.state) {

        case ENEMY_STATES.IDLE:
            this.velocity.x = 0;
            break;

        case ENEMY_STATES.CHASE: {
            const speed = 4;
            this.velocity.x = distance > 0 ? speed : -speed;

            if (Math.abs(distance) > 5) {
                this.direction = distance > 0 ? 'right' : 'left';
            }
            // 🔊 PASOS CONTROLADOS
    this.stepTimer++;

    if (this.stepTimer >= this.stepDelay) {
        this.soundManager?.playSpiderStep();
        this.stepTimer = 0;
    }
            break;
        }

case ENEMY_STATES.ATTACK:
    this.velocity.x = 0;

    if (Math.abs(distance) > 5) {
        this.direction = distance > 0 ? 'right' : 'left';
    }

    // 🔒 Cooldown activo
    if (this.attackCooldown > 0) return;

    // 🔥 LÓGICA REAL DEL ATAQUE
    this.attackFrame++;

const hitFrame = 4;
const soundOffset = 2; // 🔥 AJUSTA ESTO

// 🔊 SONIDO (ANTES DEL GOLPE)
if (this.attackFrame === hitFrame - soundOffset) {
    this.soundManager?.playSpiderAttack();
}

// 💥 DAÑO (IMPACTO REAL)
if (!this.hasHit && this.attackFrame === hitFrame) {
    player?.takeHit?.(this.attackDamage);
    this.hasHit = true;
}

    // 🔁 FIN DEL ATAQUE
    if (this.attackFrame >= this.attackDuration) {
        this.attackFrame = 0;
        this.attackCooldown = this.attackDelay;
        this.hasHit = false;
    }

    break;
    }

    // 🔊 SUSURRO CONSTANTE this.soundManager?.playStep();
// 🔊 CREAR UNA SOLA VEZ
if (!this.whisperSound && this.soundManager) {
    this.whisperSound = this.soundManager.sounds.spiderWhisper.cloneNode();
    this.whisperSound.loop = true;
    this.whisperSound.volume = 0;
}

// 🔥 INTENTAR REPRODUCIR SIEMPRE (cuando se pueda)
if (this.whisperSound && this.soundManager?.unlocked) {

    const enemyX = this.position.x + worldX;
    const playerX = player.position.x;

    const distance = Math.abs(playerX - enemyX);

    const maxDistance = 2000;
    const minDistance = 100;

    let volume = 0;

    if (distance < maxDistance) {
        volume =
            1 - ((distance - minDistance) / (maxDistance - minDistance));
    }

    // clamp
    volume = Math.max(0, Math.min(volume, 1));

    // 🔥 volumen final
    const finalVolume =
        volume * this.soundManager.masterVolume * 0.3;

    this.whisperSound.volume = finalVolume;

    // 🔥 reproducir SOLO si hay volumen
    if (finalVolume > 0.01) {

        if (this.whisperSound.paused) {
            this.whisperSound.play().catch(() => {});
        }

    } else {

        // 🔥 detener si está lejos
        this.whisperSound.pause();
        this.whisperSound.currentTime = 0;
    }
}

}
    takeHit(damage) {
        if (this.isHit) return;

        this.hp -= damage;
        this.isHit = true;

        setTimeout(() => {
            this.isHit = false;
        }, 100);

        if (this.hp <= 0) {
            this.die();
        }
    }

die() {
    this.isDead = true;

    this.soundManager?.playSpiderDeath();

    // 🔥 parar susurro
    if (this.whisperSound) {
        this.whisperSound.pause();
        this.whisperSound = null;
    }

    this.velocity.x = 0;
    this.velocity.y = 0;
}
}
