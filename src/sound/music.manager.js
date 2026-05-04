export class MusicManager {
    constructor() {
        this.audio = null;
    }

play(src, volume = 0.3) {

    if (this.audio) return;

    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = 0;

    this.audio.play();

    const fade = setInterval(() => {
        if (this.audio.volume < volume) {
            this.audio.volume += 0.01;
        } else {
            clearInterval(fade);
        }
    }, 100);
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