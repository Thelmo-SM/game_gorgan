// MOVIMIENTO
import spriteRunLeft from '../../../assets/sprites/player/run_right.png';
import spriteRunRight from '../../../assets/sprites/player/run_left.png';

// IDLE
import spriteStandLeft from '../../../assets/sprites/player/idle_right.png';
import spriteStandRight from '../../../assets/sprites/player/idle_left.png';

// JUMP
import spriteJumpLeft from '../../../assets/sprites/player/jump1_right.png';
import spriteJumpRight from '../../../assets/sprites/player/jump1_left.png';

// FALL
import spriteFallLeft from '../../../assets/sprites/player/jump2_right.png';
import spriteFallRight from '../../../assets/sprites/player/jump2_left.png';

// ATAQUES
import spriteAttack1Left from '../../../assets/sprites/player/attack1_right.png';
import spriteAttack1Right from '../../../assets/sprites/player/attack1_left.png';

import spriteAttack2Left from '../../../assets/sprites/player/attack2_right.png';
import spriteAttack2Right from '../../../assets/sprites/player/attack2_left.png';

import spriteAttack3Left from '../../../assets/sprites/player/attack3_right.png';
import spriteAttack3Right from '../../../assets/sprites/player/attack3_left.png';

import deadLeft from '../../../assets/sprites/player/player_death_left.png';
import deadRight from '../../../assets/sprites/player/player_death_right.png';

// UTILS 
import { gravity, newSprite } from "../../utils/game";

// STATES
import { PLAYER_STATES } from "./player.states.js";

export class Player {
    constructor() {
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 0, y: 1 };

        this.width = 300;
        this.height = 300;

        this.jumps = 0;
        this.maxjumps = 2;
        this.isOnGround = false;

        this.state = PLAYER_STATES.IDLE;
        this.direction = 'right';

        this.frames = 0;
        this.frameTimer = 0;
        this.comboQueued = false;

        // idle
        this.idleDuration = 5000;
        this.isHoldingIdle = false;
        this.idleStartTime = 0;

        this.hitbox = {
        offsetY: 30,
        height: this.height - 140
        }; 

        this.isHit = false;
        this.hp = 100;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 800; // ms
        this.isDead = false;

        //ATTACK
    this.attackBox = {
    offsetX: 60,
    offsetY: 130,
    width: 80,
    height: 100
};

//SONIDO
this.stepTimer = 0;
this.stepInterval = 250; // ms (ajústalo a gusto)
//ATAQUE
this.hasPlayedAttackSound = false;

this.hasHit = false;

        this.sprites = {
            stand: {
                cropWidth: 571,
                maxFrames: 22,
                right: newSprite(spriteStandRight),
                left: newSprite(spriteStandLeft),
                renderW: 360,
                renderH: 250
            },
            run: {
                cropWidth: 571,
                maxFrames: 22,
                right: newSprite(spriteRunRight),
                left: newSprite(spriteRunLeft),
                renderW: 360,
                renderH: 250
            },
            jump: {
                cropWidth: 571,
                maxFrames: 8,
                right: newSprite(spriteJumpRight),
                left: newSprite(spriteJumpLeft),
                renderW: 360,
                renderH: 250
            },
            fall: {
                cropWidth: 571,
                maxFrames: 6,
                right: newSprite(spriteFallRight),
                left: newSprite(spriteFallLeft),
                renderW: 360,
                renderH: 250
            },
            attack1: {
                cropWidth: 571,
                maxFrames: 9,
                right: newSprite(spriteAttack1Right),
                left: newSprite(spriteAttack1Left),
                frameDelay: 2,
                renderW: 335,
                renderH: 250
            },
            attack2: {
                cropWidth: 571,
                maxFrames: 9,
                right: newSprite(spriteAttack2Right),
                left: newSprite(spriteAttack2Left),
                frameDelay: 4,
                renderW: 335,
                renderH: 250
            },
            attack3: {
                cropWidth: 571,
                maxFrames: 9,
                right: newSprite(spriteAttack3Right),
                left: newSprite(spriteAttack3Left),
                frameDelay: 2,
                renderW: 335,
                renderH: 250
            },
            dead: {
    cropWidth: 571,
    maxFrames: 32,
    //right: newSprite(deadRight), if (this.direction === 'left') {
    left: newSprite(deadLeft),
    renderW: 360,
    renderH: 250
}
        };

        this.currentSprite = this.sprites.stand.right;
    }
//hitbox
    draw(context) {
        let config = this.sprites.stand;

if (this.isDead) {
    config = this.sprites.dead;
} else if (this.state === PLAYER_STATES.ATTACK_1) config = this.sprites.attack1;
else if (this.state === PLAYER_STATES.ATTACK_2) config = this.sprites.attack2;
else if (this.state === PLAYER_STATES.ATTACK_3) config = this.sprites.attack3;
else if (this.state === PLAYER_STATES.RUN) config = this.sprites.run;
else if (this.state === PLAYER_STATES.JUMP) config = this.sprites.jump;
else if (this.state === PLAYER_STATES.FALL) config = this.sprites.fall;

        if (this.isDead) {
    // 🔥 SIEMPRE usar el sprite LEFT
    this.currentSprite = this.sprites.dead.left;
} else {
    this.currentSprite = this.direction === 'left'
        ? config.left
        : config.right;
}

        const offsetX = (this.width - config.renderW) / 2;
        const offsetY = this.height - config.renderH;

        context.drawImage(
            this.currentSprite,
            config.cropWidth * this.frames,
            0,
            config.cropWidth,
            399,
            this.position.x + offsetX,
            this.position.y + offsetY,
            config.renderW,
            config.renderH
        );
            // 🔥 IMPORTANTE: resetear
            context.globalAlpha = 1;
    }

update(context, canvasHeight, keys) {

        // 💀 SI ESTÁ MUERTO, SOLO ANIMA Y DIBUJA
    if (this.isDead) {
        this.handleAnimation(keys);
        this.draw(context);
        return;
    }

    this.handleAnimation(keys);

    // movimiento vertical
    this.position.y += this.velocity.y;

    // gravedad SIEMPRE
    this.velocity.y += gravity;
    this.draw(context);

    // 🔥 RESET (igual que enemigo)
    this.isOnGround = false;
}

    handleAnimation(keys) {
        // 💀 MUERTE
if (this.isDead) {
    const config = this.sprites.dead;

    this.frameTimer++;

    if (this.frameTimer >= 6) {
        if (this.frames < config.maxFrames - 1) {
            this.frames++;
        }
        this.frameTimer = 0;
    }

    return; // 🚫 BLOQUEA TODO LO DEMÁS
}

        // ===================== ATAQUES =====================
        if (this.frames === 0) {
    this.hasHit = false;
}
        if (
            this.state === PLAYER_STATES.ATTACK_1 ||
            this.state === PLAYER_STATES.ATTACK_2 ||
            this.state === PLAYER_STATES.ATTACK_3
        ) {
            let config = this.sprites.attack1;

            if (this.state === PLAYER_STATES.ATTACK_2) config = this.sprites.attack2;
            if (this.state === PLAYER_STATES.ATTACK_3) config = this.sprites.attack3;

            this.velocity.x = 0;
            this.frameTimer++;

            if (this.frameTimer % config.frameDelay === 0) {
                this.frames++;
            }

// 🔥 SONIDO DEL GOLPE (solo una vez)
if (this.frames === 2 && !this.hasPlayedAttackSound) {
    this.onAttack?.();
    this.hasPlayedAttackSound = true;
}

            // 🔥 FIN DE ANIMACIÓN + COMBO
            if (this.frames >= config.maxFrames) {

                if (this.state === PLAYER_STATES.ATTACK_1 && this.comboQueued) {
                    this.startAttack2();
                    return;
                }

                if (this.state === PLAYER_STATES.ATTACK_2 && this.comboQueued) {
                    this.startAttack3();
                    return;
                }

                // reset
                this.frames = 0;
                this.frameTimer = 0;
                this.comboQueued = false;
                this.state = PLAYER_STATES.IDLE;
            }

            return;
        }

        // ===================== AIRE =====================
        if (!this.isOnGround) {
            let config;

            if (this.velocity.y < 0) {
                this.state = PLAYER_STATES.JUMP;
                config = this.sprites.jump;
            } else {
                this.state = PLAYER_STATES.FALL;
                config = this.sprites.fall;
            }

            this.frames = Math.min(this.frames + 1, config.maxFrames - 1);
            return;
        }

        // ===================== RUN =====================
        if (keys.right.pressed) {
            this.direction = 'right';
            this.state = PLAYER_STATES.RUN;
            this.frames = (this.frames + 1) % this.sprites.run.maxFrames;
            this.isHoldingIdle = false;

        const isRunning = keys.right.pressed || keys.left.pressed;

        // 🔥 SONIDO DE PASOS AQUÍ (correcto lugar)
if (isRunning && this.isOnGround) {
    const now = Date.now();

    if (!this.lastStepTime) this.lastStepTime = now;

    if (now - this.lastStepTime > this.stepInterval) {
        this.onStep?.();
        this.lastStepTime = now;
    }
} else {
    this.lastStepTime = null;
}

            return;
        }

        if (keys.left.pressed) {
            this.direction = 'left';
            this.state = PLAYER_STATES.RUN;
            this.frames = (this.frames + 1) % this.sprites.run.maxFrames;
            this.isHoldingIdle = false;

                // 🔥 SONIDO DE PASOS AQUÍ (correcto lugar)
const isRunning = keys.right.pressed || keys.left.pressed;

if (isRunning && this.isOnGround) {
    const now = Date.now();

    if (!this.lastStepTime) this.lastStepTime = now;

    if (now - this.lastStepTime > this.stepInterval) {
        this.onStep?.();
        this.lastStepTime = now;
    }
} else {
    this.lastStepTime = null;
}

            return;
        }

        // ===================== IDLE =====================
        this.state = PLAYER_STATES.IDLE;

        const config = this.sprites.stand;

        if (!this.isHoldingIdle) {
            this.frameTimer++;

            if (this.frameTimer >= 5) {
                this.frames++;
                this.frameTimer = 0;
            }

            if (this.frames >= config.maxFrames - 1) {
                this.frames = config.maxFrames - 1;
                this.isHoldingIdle = true;
                this.idleStartTime = Date.now();
            }
        } else {
            const elapsed = Date.now() - this.idleStartTime;

            if (elapsed >= this.idleDuration) {
                this.frames = 0;
                this.isHoldingIdle = false;
            }
        }

        //SONIDO DE ATAQUE
        if (this.frames === 0) {
        this.hasHit = false;
        this.hasPlayedAttackSound = false; // 🔥 reset
        }
    }

    // ===================== ATAQUES =====================
    attack1() {
        this.state = PLAYER_STATES.ATTACK_1;
        this.frames = 0;
        this.frameTimer = 0;
        this.comboQueued = false;

        this.hasPlayedAttackSound = false; // 🔥 RESET
    }

    startAttack2() {
        this.state = PLAYER_STATES.ATTACK_2;
        this.frames = 0;
        this.frameTimer = 0;
        this.comboQueued = false;

        this.hasPlayedAttackSound = false; // 🔥 RESET
    }

    startAttack3() {
        this.state = PLAYER_STATES.ATTACK_3;
        this.frames = 0;
        this.frameTimer = 0;
        this.comboQueued = false;

        this.hasPlayedAttackSound = false; // 🔥 RESET
    }

    onAttackInput() {
        if (
            this.state === PLAYER_STATES.ATTACK_1 ||
            this.state === PLAYER_STATES.ATTACK_2 ||
            this.state === PLAYER_STATES.ATTACK_3
        ) {
            this.comboQueued = true;
            return;
        }

        this.attack1();
    }

    jump() {
        if (this.jumps < this.maxjumps) {
            this.velocity.y = -15;
            this.jumps++;
            this.frames = 0;
            this.state = PLAYER_STATES.JUMP;

            // 🔥 SONIDO AQUÍ
            this.onJump?.();
        }
    }
//DAÑO hit
takeHit(damage) {

    if (this.isInvulnerable || this.isDead) return;

    this.hp -= damage;

    this.isHit = true;
    this.isInvulnerable = true;

    // feedback
    setTimeout(() => this.isHit = false, 200);

    // quitar invulnerabilidad
    setTimeout(() => {
        this.isInvulnerable = false;
    }, this.invulnerabilityTime);

    // 💀 MUERTE
    if (this.hp <= 0) {
        this.die();
    }
}
// 💀 MUERTE
die() {
    // Si ya entramos aquí una vez, no hagas nada más
    if (this.isDead) return;

    this.isDead = true;
    this.frames = 0;
    this.frameTimer = 0;

    this.velocity.x = 0;
    this.state = PLAYER_STATES.DEATH;

    this.onDeath?.();
    console.log('💀 PLAYER MUERTO POR PRIMERA VEZ');
}

//ATTACKBOX
isAttacking() {
    return (
        this.state === PLAYER_STATES.ATTACK_1 ||
        this.state === PLAYER_STATES.ATTACK_2 ||
        this.state === PLAYER_STATES.ATTACK_3
    );
}
}