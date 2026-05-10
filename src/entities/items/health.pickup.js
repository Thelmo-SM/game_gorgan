export class HealingItem {
    constructor({ x, y, image }) {

        this.position = {
            x,
            y
        };

        this.image = image;

        this.width = 120;
        this.height = 120;

        this.collected = false;

        // efecto flotante
        this.floatOffset = 0;
    }

    update() {
        this.floatOffset += 0.05;
    }

    draw(c, worldX) {

    if (this.collected) return;

    this.update();

    const floatY = Math.sin(this.floatOffset) * 8;

    const drawX = this.position.x + worldX;

    // DEBUG
    //c.fillStyle = 'red';
    //c.fillRect(drawX, this.position.y + floatY, 120, 120);

    c.drawImage(
        this.image,
        drawX,
        this.position.y + floatY,
        this.width,
        this.height
    );
}
}