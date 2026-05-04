export class Mountains {
    constructor({ image }) {
        this.image = new Image();
        this.image.src = image;

        this.parallax = 0.2;

        this.width = 2500;
        this.height = 800;

        this.offsetY = 0;
        this.baseX = 0;

        this.repeat = true; // 🔥 NUEVO
    }

    draw(context, worldX) {
        if (!this.image.complete) return;

        const x = this.baseX + worldX * this.parallax;
        const y = context.canvas.height - this.height - this.offsetY;

        // 🔥 SOLO UNA VEZ
        context.drawImage(this.image, x, y, this.width, this.height);

        // 🔁 SOLO SI QUIERES LOOP
        if (this.repeat) {
            context.drawImage(
                this.image,
                x + this.width,
                y,
                this.width,
                this.height
            );
        }
    }
}