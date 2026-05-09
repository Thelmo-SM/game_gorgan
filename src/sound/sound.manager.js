export class SoundManager {
    constructor(sounds) {
        this.sounds = sounds;

        this.masterVolume = 1;
        this.sfxVolume = 0.2;

        this.lastStep = -1;
        this.unlocked = false;

        this.activeSounds = [];
    }

    unlock() {
        this.unlocked = true;
    }

safePlay(sound) {

    if (!this.unlocked) return;

    // 🔥 guardar referencia
    this.activeSounds.push(sound);

    sound.play().catch(() => {});

    // 🔥 limpiar cuando termine
    sound.onended = () => {

        this.activeSounds = this.activeSounds.filter(
            s => s !== sound
        );

    };
}

    // ================= PLAYER =================

    playStep() {
        let random;

        do {
            random = Math.floor(Math.random() * this.sounds.steps.length);
        } while (random === this.lastStep);

        this.lastStep = random;

        const sound = this.sounds.steps[random].cloneNode();
        sound.volume = this.masterVolume * this.sfxVolume;

        this.safePlay(sound);
    }

    playAttack() {
        const sound = this.sounds.attack.cloneNode();
        sound.volume = 0.4;
        sound.playbackRate = 0.9;

        this.safePlay(sound);
    }

    playJump() {
        const sound = this.sounds.jump.cloneNode();
        sound.volume = this.masterVolume * 0.6;

        this.safePlay(sound);
    }

    playDeath() {
        const sound = this.sounds.death.cloneNode();
        sound.volume = this.masterVolume * 0.5;

        this.safePlay(sound);
    }

    // ================= LASER =================

    playLaserShoot() {
        const sound = this.sounds.laserShootSound.cloneNode();
        sound.volume = this.masterVolume * 0.5;
        sound.playbackRate = 1;

        this.safePlay(sound);
    }

    playLaserCharge() {
        const sound = this.sounds.laserChargeSound.cloneNode();
        sound.volume = this.masterVolume * 0.4;

        this.safePlay(sound);
    }

    // ================= SPIDER =================

    playSpiderStep() {
        const sound = this.sounds.spiderStep.cloneNode();
        sound.volume = this.masterVolume * 0.3;

        sound.playbackRate = 1.2;

        this.safePlay(sound);
    }

    playSpiderAttack() {
        const sound = this.sounds.spiderAttack.cloneNode();
        sound.volume = this.masterVolume * 0.2;
        sound.playbackRate = 1 + Math.random() * 0.1;

        this.safePlay(sound);
    }

    playSpiderDeath() {
        const sound = this.sounds.spiderDeath.cloneNode();
        sound.volume = this.masterVolume * 0.6;

        this.safePlay(sound);
    }

playSpiderWhisperLoop() {

    // 🔥 evitar duplicados
    if (this.spiderWhisperLoop) {
        return this.spiderWhisperLoop;
    }

    const sound = this.sounds.spiderWhisper.cloneNode();

    sound.loop = true;
    sound.volume = this.masterVolume * 0.1;
    sound.currentTime = 0;

    sound.play().catch(() => {});

    this.spiderWhisperLoop = sound;

    return sound;
}

// ================= OBJECTS / TRAPS =================

// En tu SoundManager
playTrapSpatial(volume) {
    if (!this.sounds.trapAction || volume <= 0) return; 

    const sound = this.sounds.trapAction.cloneNode();
    
    // Limitamos el volumen entre 0 y el máximo deseado (ej. 0.5)
    sound.volume = Math.min(volume, 0.5) * this.masterVolume;
    
    sound.playbackRate = 0.9 + Math.random() * 0.2;
    this.safePlay(sound);
}

playPendulumLoop() {
    if (!this.unlocked) return;

    if (this.pendulumLoop) return this.pendulumLoop;

    const sound = this.sounds.pendulumSound.cloneNode();
    sound.loop = true;
    sound.volume = 0;

    sound.play().catch(() => {});
    this.pendulumLoop = sound;

    return sound;
}

updatePendulumSound(pendulum, player, worldX) {
    const sound = this.playPendulumLoop();
    if (!sound) return;

    const speed = Math.abs(pendulum.angle);

    const dx = (pendulum.position.x + worldX) - player.position.x;
    const distance = Math.abs(dx);

    const maxDistance = 1500;

    let volume = 1 - (distance / maxDistance);
    if (volume < 0) volume = 0;

    // 🔥 volumen final
    let finalVolume = volume * speed * this.masterVolume;

    // 🔥 CLAMP (esto evita el error)
    finalVolume = Math.max(0, Math.min(1, finalVolume));

    sound.volume = finalVolume;

    // pitch
    sound.playbackRate = 0.8 + speed * 0.5;
}

stopAll() {

    this.activeSounds.forEach(sound => {

        sound.pause();
        sound.currentTime = 0;

    });

    this.activeSounds = [];

    // 🔥 péndulo
    if (this.pendulumLoop) {

        this.pendulumLoop.pause();
        this.pendulumLoop.currentTime = 0;
        this.pendulumLoop = null;
    }

    // 🔥 araña
    if (this.spiderWhisperLoop) {

        this.spiderWhisperLoop.pause();
        this.spiderWhisperLoop.currentTime = 0;
        this.spiderWhisperLoop = null;
    }
}

updateSpiderWhisperVolume(enemy, player, worldX) {

    const sound = this.playSpiderWhisperLoop();

    if (!sound) return;

    // 🔥 posición en pantalla
    const enemyX = enemy.position.x + worldX;
    const playerX = player.position.x;

    // 🔥 distancia
    const distance = Math.abs(enemyX - playerX);

    // 🔥 rango máximo audible
    const maxDistance = 2500;

    // 🔥 volumen dinámico
    let volume = 1 - (distance / maxDistance);

    // 🔥 clamp
    volume = Math.max(0, Math.min(1, volume));

    // 🔥 volumen final
    sound.volume = volume * 0.15 * this.masterVolume;
}
}