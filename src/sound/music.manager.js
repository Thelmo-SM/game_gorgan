export class MusicManager {
    constructor() {
        this.audio = null;
    }

play(src, volume = 1) {

    // 🔥 crear audio si no existe
    if (!this.audio) {
        this.audio = new Audio();
    }

    this.audio.src = src;
    this.audio.loop = true;

    // 🔥 evita error de null
    this.audio.volume = volume ?? 1;

    this.audio.play().catch(() => {});
}
setVolume(value) {
    if (this.audio) {
        this.audio.volume = value;
    }
}

    stop() {
        if (!this.audio) return;

        this.audio.pause();
        this.audio = null;
    }
}