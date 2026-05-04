import { Laser } from "../weapons/laser";
import laserEnemySprite from '../../../assets/sprites/enemies/bm/villano_2.png';
import laserEnemyDeadSprite from '../../../assets/sprites/enemies/bm/villano_2_dead.png';

export class LaserEnemy {
    constructor({ x, y, lasers, soundManager }) {
        this.position = { x, y };

        this.width = 1000;
        this.height = 500;

        this.lasers = lasers;

        // 🔥 SPRITE
        this.image = new Image();
        this.image.src = laserEnemySprite;

        this.loaded = false;
        this.image.onload = () => this.loaded = true;
        this.image.onerror = () => console.error('Error cargando sprite LaserEnemy');

        this.direction = 'left';

this.hitbox = {
    offsetX: 300,   // mueve al centro
    width: 300,     // 👈 MUCHO más estrecho
    offsetY: -90,
    height: 200
};

        // 🎞️ ANIMACIÓN
        this.frames = 0;
        this.maxFrames = 62;
        this.frameTimer = 0;
        this.frameSpeed = 2;

        this.visualOffsetY = 170;

        // 🎯 DETECCIÓN
        this.isActive = false;
        this.detectionRange = 1200;

        // 🔫 DISPARO
        this.hasShot = false;
        this.holdFrameTime = 60;
        this.holdTimer = 0;

        this.mouthOffset = {
            x: 650,
            y: 290
        };

        // ❤️ VIDA
        this.maxHP = 150;
        this.hp = this.maxHP;
        this.isDead = false;
        this.isHit = false;

        //MUERTE
        // 🔥 SPRITES
this.sprites = {
    alive: new Image(),
    dead: new Image()
};

this.sprites.alive.src = laserEnemySprite;
this.sprites.dead.src = laserEnemyDeadSprite;

this.loaded = false;
this.imagesLoaded = 0;

const markLoaded = () => {
    this.imagesLoaded++;
    if (this.imagesLoaded === 2) this.loaded = true;
};

this.sprites.alive.onload = markLoaded;
this.sprites.dead.onload = markLoaded;

this.deadFrames = 0;
this.deadMaxFrames = 12; // 👈 AJUSTA según sprite

//SONIDOS
this.soundManager = soundManager;
this.hasPlayedChargeSound = false;
    }

update(context, worldX, player) {

    if (this.isDead) {

        this.frameTimer++;

        if (this.frameTimer >= this.frameSpeed) {
            this.frameTimer = 0;

            if (this.frames < this.deadMaxFrames - 1) {
                this.frames++;
            }
        }

        this.draw(context, worldX);
        return;
    }

    const enemyScreenX = this.position.x + worldX;

    const distance = Math.abs(player.position.x - enemyScreenX);
    this.isActive = distance < this.detectionRange;

    // 🔥 DIRECCIÓN
    const enemyCenter = enemyScreenX + this.width / 2;
    const playerCenter = player.position.x + player.width / 2;

    const tolerance = 20;

    if (playerCenter > enemyCenter + tolerance) {
        this.direction = 'right';
    } else if (playerCenter < enemyCenter - tolerance) {
        this.direction = 'left';
    }

    // =========================
    // 🔥 COMPORTAMIENTO
    // =========================
    if (this.isActive) {

        this.frameTimer++;

        if (this.frameTimer >= this.frameSpeed) {
            this.frameTimer = 0;

            if (this.frames < this.maxFrames - 1) {

                // 😮‍💨 SONIDO DE CARGA (ANTES DEL DISPARO)
                if (this.frames === this.maxFrames - 55 && !this.hasPlayedChargeSound) {
                this.soundManager?.playLaserCharge();
                this.hasPlayedChargeSound = true;
                }

                // 🔊 SONIDO ANTES DEL DISPARO
                if (this.frames === this.maxFrames - 6 && !this.hasPlayedShootSound) {
                    this.soundManager?.playLaserShoot();
                    this.hasPlayedShootSound = true;
                }

                this.frames++;

            } else {

                if (!this.hasShot) {
                    this.shoot(); // 🔥 SOLO dispara (sin sonido aquí)
                    this.hasShot = true;
                }

                this.holdTimer++;

                if (this.holdTimer >= this.holdFrameTime) {
                    this.frames = 0;
                    this.hasShot = false;
                    this.holdTimer = 0;

                    // 🔥 RESET DEL SONIDO
                    this.hasPlayedShootSound = false;
                    this.hasPlayedChargeSound = false;
                }
            }
        }

    } else {
        this.frames = 0;
    }

    this.draw(context, worldX);
}
    shoot() {
        const direction = this.direction;

        const baseX = this.position.x;
        const baseY = this.position.y;

        const drawY = baseY - this.height + this.visualOffsetY;

        const offsetX = direction === 'right'
            ? this.mouthOffset.x
            : this.width - this.mouthOffset.x;

        const offsetY = this.mouthOffset.y;

        const laserX = baseX + offsetX;
        const laserY = drawY + offsetY;

        // 🔊 SONIDO DEL DISPARO
       // this.soundManager?.playLaserShoot(); if (this.holdTimer >= this.holdFrameTime) {

        this.lasers.push(
            new Laser({
                x: laserX,
                y: laserY,
                direction
            })
        );
    }

draw(context, worldX) {
    const drawX = this.position.x + worldX;
    const drawY = this.position.y - this.height + this.visualOffsetY;

    context.save();

    // ⚡ HIT FLASH (más visible)
    if (this.isHit) {
        context.globalAlpha = 0.6;
        context.filter = 'brightness(3) contrast(2)';
    }

    if (!this.loaded) {
        context.fillStyle = 'purple';
        context.fillRect(drawX, drawY, this.width, this.height);
        context.restore();
        return;
    }

    // 🔥 SELECCIÓN DE SPRITE
    const currentImage = this.isDead
        ? this.sprites.dead
        : this.sprites.alive;

    const maxFrames = this.isDead
        ? this.deadMaxFrames
        : this.maxFrames;

    // ✅ SOLO UNA VEZ (EL ERROR ESTABA AQUÍ)
    const cropWidth = currentImage.width / maxFrames;
    const cropHeight = currentImage.height;

    // 🎯 DRAW
    if (this.direction === 'left') {
        context.drawImage(
            currentImage,
            cropWidth * this.frames,
            0,
            cropWidth,
            cropHeight,
            drawX,
            drawY,
            this.width,
            this.height
        );
    } else {
        context.translate(drawX + this.width, 0);
        context.scale(-1, 1);

        context.drawImage(
            currentImage,
            cropWidth * this.frames,
            0,
            cropWidth,
            cropHeight,
            0,
            drawY,
            this.width,
            this.height
        );
    }

    context.restore();

    // ❤️ VIDA (solo si está vivo)
    if (!this.isDead) {
        const barWidth = this.width * 0.6;
        const barHeight = 8;

        const barX = drawX + this.width * 0.2;
        const barY = drawY - 30;

        context.fillStyle = 'black';
        context.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

        context.fillStyle = 'red';
        context.fillRect(
            barX,
            barY,
            (this.hp / this.maxHP) * barWidth,
            barHeight
        );
    }
}

takeHit(damage) {
    if (this.isHit || this.isDead) return;

    this.hp -= damage;
    this.isHit = true;

    // 🔥 mini freeze (game feel)
    this.frameSpeed = 6;

    setTimeout(() => {
        this.isHit = false;
        this.frameSpeed = 2;
    }, 120);

    if (this.hp <= 0) {
        this.die();
    }
}

die() {
    this.isDead = true;

    this.frames = 0;
    this.frameTimer = 0;

    this.velocity = { x: 0, y: 0 };
}
}