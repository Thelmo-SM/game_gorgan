export class Grass {
    constructor({ x, y, image }) {
        this.position = { x, y };

        this.image = new Image();
        this.image.src = image;

        this.width = 490;
        this.height = 360;

        // 🔥 control fino
        this.offsetX = 55;
        this.offsetY = -55;
    }

    draw(context, worldX) {
        if (!this.image.complete) return;

        const drawX = this.position.x + worldX + this.offsetX;
        const drawY = this.position.y + this.offsetY;

        context.drawImage(
            this.image,
            drawX,
            drawY,
            this.width,
            this.height
        );

        return drawX; // 🔥 para loop infinito
    }
}