export class PendulumTrap {
    constructor({ x, y, image, length = 300, speed = 0.05, maxAngle = Math.PI / 3 }) {
        this.position = { x, y };
        this.image = image;
        this.length = length;
        this.speed = speed;
        this.maxAngle = maxAngle;
        this.angle = 0;
        this.time = 0;

        this.width = 500;
        this.height = 700;

        this.currentHammerPos = { x: 0, y: 0 };

        // 🔥 NUEVO: hitbox del martillo
        this.hitbox = {
            offsetX: -80,
            offsetY: 190,
            width: 300,
            height: 160
        };
        this.hammerVisualOffset = {
    x: 0,
    y: 0 // 👈 AJUSTA ESTO hasta que coincida con la cabeza del martillo
};
    }

update() {
    this.time += this.speed;
    this.angle = Math.sin(this.time) * this.maxAngle;

    // 🔥 calcula posición SIN dibujar
    this.currentHammerPos = {
        x: this.position.x + this.length * Math.sin(this.angle),
        y: this.position.y + this.length * Math.cos(this.angle)
    };
}

draw(c, worldX) {
    const drawX = this.position.x + worldX;

    const hammerX = drawX + this.length * Math.sin(this.angle);
    const hammerY = this.position.y + this.length * Math.cos(this.angle);

    // 🔥 GUARDA POSICIÓN REAL EN PANTALLA
    this.screenHammerPos = {
        x: hammerX,
        y: hammerY
    };

    // cadena
    c.beginPath();
    c.moveTo(drawX, this.position.y);
    c.lineTo(hammerX, hammerY);
    c.stroke();

    // sprite
    if (this.image && this.image.complete) {
        c.save();
        c.translate(hammerX, hammerY);
        c.rotate(-this.angle);

        c.drawImage(
            this.image,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        c.restore();
    }
}
    getHammerCenter() {
    return {
        x: this.currentHammerPos.x + this.hammerVisualOffset.x,
        y: this.currentHammerPos.y + this.hammerVisualOffset.y
    };
}
}