import step1 from '../../assets/sounds/playerSounds/paso_1.mp3';
import step2 from '../../assets/sounds/playerSounds/paso_2.mp3';
import step3 from '../../assets/sounds/playerSounds/paso_3.mp3';

import attackSound from '../../assets/sounds/playerSounds/ataque_player.mp3';
import jumpSound from '../../assets/sounds/playerSounds/salto.mp3';
import deathSound from '../../assets/sounds/playerSounds/muerte.mp3';

// LASER
import laserShoot from '../../assets/sounds/laserEnemy/laser.mp3';
import laserCharge from '../../assets/sounds/laserEnemy/enemy.mp3';

// SPIDER
import spiderStep from '../../assets/sounds/bjEnemy/pasos.mp3';
import spiderAttack from '../../assets/sounds/bjEnemy/ataque.mp3';
import spiderDeath from '../../assets/sounds/bjEnemy/muerte.mp3';
import spiderWhisper from '../../assets/sounds/bjEnemy/susurro.mp3';

//TRAPS
import trapSound from '../../assets/sounds/trapsSound/trampa_1.mp3';
import pendulumLoop from '../../assets/sounds/trapsSound/trampa_2.mp3';

//MENU
import menuMusic from '../../assets/sounds/menuSound.mp3';

//VIDA
import healSound from '../../assets/sounds/playerSounds/healingISound.mp3';

export const createSounds = () => {

    const steps = [
        new Audio(step1),
        new Audio(step2),
        new Audio(step3)
    ];

    const attack = new Audio(attackSound);
    const jump = new Audio(jumpSound);
    const death = new Audio(deathSound);

    const laserShootSound = new Audio(laserShoot);
    const laserChargeSound = new Audio(laserCharge);

    const spiderStepSound = new Audio(spiderStep);
    const spiderAttackSound = new Audio(spiderAttack);
    const spiderDeathSound = new Audio(spiderDeath);
    const spiderWhisperSound = new Audio(spiderWhisper);

    const trapAction = new Audio(trapSound);
    const pendulumSound = new Audio(pendulumLoop);

    const menu = new Audio(menuMusic);

    const heal = new Audio(healSound);

    return {
        // PLAYER
        steps,
        attack,
        jump,
        death,

        // LASER
        laserShootSound,
        laserChargeSound,

        // SPIDER
        spiderStep: spiderStepSound,
        spiderAttack: spiderAttackSound,
        spiderDeath: spiderDeathSound,
        spiderWhisper: spiderWhisperSound,

        //TRAPS
        trapAction: trapAction,
        pendulumSound,
        
        // 🎧 MENU
        menu,

        //VIDA
        heal
    };
};