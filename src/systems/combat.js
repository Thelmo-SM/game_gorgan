export const checkAttackCollision = (player, enemy, worldX) => {

    if (enemy.isDead) return;
    if (!player.isAttacking()) return;

    const attackX = player.direction === 'right'
        ? player.position.x + player.attackBox.offsetX
        : player.position.x - player.attackBox.offsetX;

    const attackY = player.position.y + player.attackBox.offsetY;

    const attackWidth = player.attackBox.width;
    const attackHeight = player.attackBox.height;

    const enemyX = enemy.position.x + worldX;
    const enemyY = enemy.position.y;

    // 🔥 👇 AQUÍ EXACTAMENTE
    console.log({
        attackX,
        enemyX,
        worldX,
        playerX: player.position.x
    });

    const hit =
        attackX < enemyX + enemy.width &&
        attackX + attackWidth > enemyX &&
        attackY < enemyY + enemy.height &&
        attackY + attackHeight > enemyY;

    const isHitFrame = player.frames >= 3 && player.frames <= 5;

    if (hit && !player.hasHit && isHitFrame) {
        console.log('💥 HIT CONFIRMADO');
        enemy.takeHit?.(10);
        player.hasHit = true;
    }
};