export class SpikeTrap {
    constructor({ x, y, image }) {
        this.position = { x, y };
        this.image = image;
        this.framesMax = 30; 
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        
        // --- PARÁMETROS EDITABLES ---
        this.framesHold = 2;    // Velocidad de los frames (menor = más rápido)
        this.waitDuration = 80; // Pausa al final (60 frames aprox. 1 segundo a 60fps)
        // ----------------------------

        this.waitTimer = 0;
        this.isWaiting = false;
        this.width = 625;
        this.height = 600;
        this.isDangerous = false;

        // Ajuste de hitbox (puedes editar esto para ser más preciso)
        this.hitbox = {
            offsetX: 230,
            width: 160,
            height: 200
        };
    }

    draw(c, worldX) {
        const drawX = this.position.x + worldX;
        const spriteWidth = this.image.width / this.framesMax;

        // Dibujar Sprite
        c.drawImage(
            this.image,
            this.framesCurrent * spriteWidth,
            0,
            spriteWidth,
            this.image.height,
            drawX,
            this.position.y,
            this.width,
            this.height
        );

        // --- MODO DEBUG: VISUALIZAR COLISIÓN ---
       // c.strokeStyle = this.isDangerous ? 'red' : 'green';
        //c.lineWidth = 2;
        // c.strokeRect(
        //     drawX + this.hitbox.offsetX,
        //     this.position.y + (this.height - this.hitbox.height),
        //     this.hitbox.width,
        //     this.hitbox.height
        // );
    }

update(c, worldX, onActivate) { // Añadimos onActivate aquí
    this.draw(c, worldX);

    if (this.isWaiting) {
        this.waitTimer++;
        if (this.waitTimer >= this.waitDuration) {
            this.isWaiting = false;
            this.waitTimer = 0;
            this.framesCurrent = 0;
        }
        return;
    }

    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMax - 1) {
            this.framesCurrent++;
            
            // --- NUEVA LÓGICA DE SONIDO ---
            // Si llegamos al frame exacto donde salen los pinchos (ej: 12)
            if (this.framesCurrent === 12 && typeof onActivate === 'function') {
                onActivate(); 
            }

        } else {
            this.isWaiting = true;
        }
    }

    this.isDangerous = (this.framesCurrent >= 12 && this.framesCurrent <= 18);
}
}