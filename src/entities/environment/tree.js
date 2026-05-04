export class Tree {
    constructor({ x, y, image }) {
        this.position = { x, y };

        this.image = new Image();
        this.image.src = image;

        // 🔥 tamaño (editable)
        this.width = 300;
        this.height = 500;

        // 🔥 parallax
        this.parallax = 0.6;

        // 🔥 ajustes finos
        this.offsetY = 10;  // subir/bajar sin tocar la base
        this.baseX = 65;    // mover en el mundo
    }

    draw(context, worldX) {
        if (!this.image.complete) return;

        const drawX = this.baseX + this.position.x + worldX * this.parallax;
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