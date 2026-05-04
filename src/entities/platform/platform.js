export class Platform {
    constructor({ 
        x, 
        y, 
        image, 
        collisionOffsetX = 0,
        collisionOffsetY = 0, 
        collisionWidth = null,
        collisionHeight = null,
        parallax 
    }) {
        this.position = { x, y };

        this.parallax = parallax;

        this.width = 400;
        this.height = 400;

        // 🔥 HITBOX COMPLETA
        this.collisionOffsetX = collisionOffsetX;
        this.collisionOffsetY = collisionOffsetY;
        this.collisionWidth = collisionWidth || this.width;
        this.collisionHeight = collisionHeight || this.height;

        this.image = new Image();
        this.image.src = image;
    }

draw(context, worldX = 0) {
    if (!this.image.complete) return;

    const drawX = this.position.x + worldX;

    // 🔥 ESCALA SEGÚN DISTANCIA
    const scale = 1 - (this.position.y / context.canvas.height) * 0.3;

    const scaledWidth = this.width * scale;
    const scaledHeight = this.height * scale;

    // 🔥 AJUSTE PARA QUE NO SE DESPLACE RARO
    const offsetX = (scaledWidth - this.width) / 2;

    context.drawImage(
        this.image,
        drawX - offsetX,
        this.position.y,
        scaledWidth,
        scaledHeight
    );
}
}