import sky from '../../../assets/background/sky.webp';

export class Background {
    constructor() {
        this.image = new Image();
        this.image.src = sky;
    }

    draw(context) {
        if (!this.image.complete) return;

        context.drawImage(
            this.image,
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );
    }
}
//ughug