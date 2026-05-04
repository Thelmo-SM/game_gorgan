// src/core/input.js
export const keys = {
    right: { pressed: false },
    left: { pressed: false },
    jump: { pressed: false },
    attack1: { pressed: false }
};

export let lastKey = '';

export const handleInput = (player) => {
    window.addEventListener('keydown', ({ keyCode, repeat }) => {
        switch (keyCode) {
            case 39: keys.right.pressed = true; lastKey = 'right'; break;
            case 37: keys.left.pressed = true; lastKey = 'left'; break;
            case 32:
                if (!keys.jump.pressed) {
                    player.jump();
                    keys.jump.pressed = true;
                }
                break;
            case 88:
                if (repeat) break;
                player.onAttackInput();
                keys.attack1.pressed = true;
                break;
        }
    });

    window.addEventListener('keyup', ({ keyCode }) => {
        switch (keyCode) {
            case 39: keys.right.pressed = false; break;
            case 37: keys.left.pressed = false; break;
            case 32: keys.jump.pressed = false; break;
            case 88: keys.attack1.pressed = false; break;
        }
    });
};