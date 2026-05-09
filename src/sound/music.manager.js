export class MusicManager {
    constructor() {
        this.audio = null;
    }

    play(src, volume = 1) {

        // 🔥 detener audio anterior
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }

        this.audio = new Audio(src);

        this.audio.loop = true;
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

        // 🔥 reinicia completamente
        this.audio.currentTime = 0;

        // 🔥 fuerza descarga del audio
        this.audio.src = '';

        this.audio.load();

        this.audio = null;
    }

    
}