export class Rock {
    constructor({ x, y, image }) {
        this.position = { x, y };

        this.image = new Image();
        this.image.src = image;

        this.width = 120;
        this.height = 100;

        this.offsetY = 0;
    }

    draw(context, worldX) {
        if (!this.image.complete) return;

        const drawX = this.position.x + worldX;
        const drawY = this.position.y + this.offsetY;

        context.drawImage(
            this.image,
            drawX,
            drawY,
            this.width,
            this.height
        );

        return drawX;
    }
}