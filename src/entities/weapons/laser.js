import laserSprite from '../../../assets/sprites/enemies/bm/lazer.png';

// 🔥 CARGA GLOBAL (UNA SOLA VEZ)
const laserImage = new Image();
laserImage.src = laserSprite;

export class Laser {
    constructor({ x, y, direction }) {
        this.position = { x, y };
        this.direction = direction;

        this.height = 130;
        this.length = 3000; // 🔥 largo del rayo

        this.duration = 100; // tiempo en pantalla
        
    }

  update(context, worldX) {
    this.duration--;
    this.draw(context, worldX);
}

    draw(context, worldX) {
        const drawX = this.position.x + worldX;

        // 🔥 evita parpadeo
        if (!laserImage.complete) return;

        const segmentWidth = laserImage.width;
        const y = this.position.y;

        context.save();

        if (this.direction === 'right') {
            for (let i = 0; i < this.length; i += segmentWidth) {
                context.drawImage(
                    laserImage,
                    drawX + i,
                    y,
                    segmentWidth,
                    this.height
                );
            }
        } else {
            for (let i = 0; i < this.length; i += segmentWidth) {
                context.drawImage(
                    laserImage,
                    drawX - i - segmentWidth,
                    y,
                    segmentWidth,
                    this.height
                );
            }
        }

        context.restore();
    }
}