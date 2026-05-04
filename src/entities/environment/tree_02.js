export class Tree_02 {
    constructor({ x, y, image }) {
        this.position = { x, y };

        this.image = new Image();
        this.image.src = image;

        // 🌳 IDENTIDAD PROPIA
        this.width = 1500;
        this.height = 1000;

        this.offsetY = 590;

        // 🔥 comportamiento distinto
        this.parallax = 0.5;
    }

    draw(context, worldX) {
        if (!this.image.complete) return;

        const drawX = this.position.x + worldX * this.parallax;
        const drawY = this.position.y - this.offsetY;

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