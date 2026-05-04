import step1 from '../../assets/sounds/playerSounds/paso_1.wav';
import step2 from '../../assets/sounds/playerSounds/paso_2.wav';
import step3 from '../../assets/sounds/playerSounds/paso_3.wav';

import attackSound from '../../assets/sounds/playerSounds/ataque_player.wav';
import jumpSound from '../../assets/sounds/playerSounds/salto.wav';
import deathSound from '../../assets/sounds/playerSounds/muerte.wav';

// LASER
import laserShoot from '../../assets/sounds/laserEnemy/laser.wav';
import laserCharge from '../../assets/sounds/laserEnemy/enemy.wav';

// SPIDER
import spiderStep from '../../assets/sounds/bjEnemy/pasos.wav';
import spiderAttack from '../../assets/sounds/bjEnemy/ataque.wav';
import spiderDeath from '../../assets/sounds/bjEnemy/muerte.wav';
import spiderWhisper from '../../assets/sounds/bjEnemy/susurro.wav';

//TRAPS
import trapSound from '../../assets/sounds/trapsSound/trampa_1.wav';
import pendulumLoop from '../../assets/sounds/trapsSound/trampa_2.wav';

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
        pendulumSound
    };
};