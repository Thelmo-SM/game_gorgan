export const checkPlatformCollision = (entity, platform) => {

    const tolerance = 2;

    // 🔥 hitbox real del entity
    const hitboxTop = entity.position.y + entity.hitbox.offsetY;
    const hitboxBottom = hitboxTop + entity.hitbox.height;

    const entityLeft = entity.position.x;
    const entityRight = entity.position.x + entity.width;

    // 🔥 HITBOX REAL DE LA PLATAFORMA (FIX)
    const platformTop = platform.position.y + (platform.collisionOffsetY || 0);

    const platformLeft = platform.position.x + (platform.collisionOffsetX || 0);
    const platformRight = platformLeft + (platform.collisionWidth || platform.width);

    if (
        hitboxBottom <= platformTop + tolerance &&
        hitboxBottom + entity.velocity.y >= platformTop &&
        entityRight > platformLeft &&
        entityLeft < platformRight
    ) {
        entity.velocity.y = 0;

        entity.position.y = Math.floor(
            platformTop - entity.hitbox.height - entity.hitbox.offsetY
        );

        entity.isOnGround = true;

        if ('jumps' in entity) {
            entity.jumps = 0;
        }
    }
};