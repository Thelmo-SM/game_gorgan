export function renderFog(ctx, game) {
    const { canvas, worldX, fogImage } = game;

    const time = performance.now() * 0.001;

    const layers = [
        { speed: 0.9, alpha: 0.15, y: 50 },
        { speed: 0.9, alpha: 0.2, y: 100 },
        { speed: 0.9, alpha: 0.25, y: 150 }
    ];

    layers.forEach(layer => {

        const baseX = (worldX * layer.speed) % canvas.width;

        // 🔥 movimiento vertical suave
        const yOffset = Math.sin(time * 0.5 + layer.y) * 10;

        ctx.globalAlpha = layer.alpha;

        for (let i = -1; i < 2; i++) {
            ctx.drawImage(
                fogImage,
                baseX + i * canvas.width,
                layer.y + yOffset,
                canvas.width,
                canvas.height * 0.6 // 👈 recortamos para que no cubra todo
            );
        }
    });

    ctx.globalAlpha = 1;
}