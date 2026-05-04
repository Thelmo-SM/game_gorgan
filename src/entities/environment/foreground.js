export class ForegroundItem {
    constructor({ x, y, image, width, height, parallax = 1.2, hasReflection = false }) {
        this.position = { x, y };

        this.image = new Image();
        this.image.src = image;

        this.width = width;
        this.height = height;

        this.parallax = parallax;

        // 🔥 activar reflejo solo si quieres (lago)
        this.hasReflection = hasReflection;
    }

    draw(context, worldX) {

        // 🔥 CORRECCIÓN CLAVE (parallax correcto)
        const drawX = (this.position.x + worldX) * this.parallax;
        console.log(drawX, this.position.y);

        // 🟦 OBJETO NORMAL
        context.drawImage(
            this.image,
            drawX,
            this.position.y,
            this.width,
            this.height
        );

        // 🌊 REFLEJO (solo si aplica)
        if (this.hasReflection) {

            context.save();

            context.globalAlpha = 0.50; // 🔥 transparencia suave
            context.scale(2, -8); // 🔥 invertir eje Y
            context.filter = 'blur(40px)'; // 🔥 opcional (agua más real)

            context.drawImage(
                this.image,
                drawX,
                -(this.position.y * 2 + this.height), // 🔥 ajuste correcto
                this.width,
                this.height
            );

            context.restore();
        }
    }
}