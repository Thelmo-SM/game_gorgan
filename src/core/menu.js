import backgroundImage from '../../assets/menu.webp';

export class Menu {
    constructor({ canvas, c, onSelect }) {
        this.canvas = canvas;
        this.c = c;

        this.options = ['INICIAR JUEGO', 'OPCIONES', 'CREDITOS'];
        this.selectedIndex = 0;

        this.blinkFrame = 0;
        this.cooldown = 0;

        this.onSelect = onSelect;

        // 🔥 IMAGEN DE FONDO
        this.backgroundImage = new Image();
        this.backgroundLoaded = false;

        this.backgroundImage.src = backgroundImage;

        this.backgroundImage.onload = () => {
            this.backgroundLoaded = true;
        };

        // 🔥 SISTEMA DE PANTALLAS
        this.screen = 'menu'; // 'menu' | 'comingSoon' | 'credits'
    }

    update(keys) {
        this.blinkFrame++;

        // 🔥 SI ESTÁS EN SUBPANTALLA
        if (this.screen !== 'menu') {
            if (keys.enter?.pressed) {
                this.screen = 'menu';
                keys.enter.pressed = false;
            }
            return;
        }

        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        if (keys.up?.pressed) {
            this.selectedIndex =
                (this.selectedIndex - 1 + this.options.length) %
                this.options.length;

            this.cooldown = 10;
        }

        if (keys.down?.pressed) {
            this.selectedIndex =
                (this.selectedIndex + 1) %
                this.options.length;

            this.cooldown = 10;
        }

        if (keys.enter?.pressed) {
            const option = this.options[this.selectedIndex];

            if (option === 'OPCIONES') {
                this.screen = 'comingSoon';
            } 
            else if (option === 'CREDITOS') {
                this.screen = 'credits';
            } 
            else {
                if (this.onSelect) {
                    this.onSelect(option);
                }
            }

            keys.enter.pressed = false;
        }
    }

    draw() {
        const c = this.c;

        this.drawBackground();

        // =========================
        // 🔥 PANTALLA: PRÓXIMAMENTE
        // =========================
        if (this.screen === 'comingSoon') {
            c.fillStyle = 'rgba(0,0,0,0.7)';
            c.fillRect(0, 0, this.canvas.width, this.canvas.height);

            c.textAlign = 'center';
            c.textBaseline = 'middle';

            c.font = '50px GameFont';
            c.fillStyle = 'white';

            c.fillText(
                'PRÓXIMAMENTE...',
                this.canvas.width / 2,
                this.canvas.height / 2
            );

            c.font = '20px GameFont';
            c.fillText(
                'Presiona ENTER para volver',
                this.canvas.width / 2,
                this.canvas.height / 2 + 60
            );

            return;
        }

        // =========================
        // 🔥 PANTALLA: CRÉDITOS
        // =========================
        if (this.screen === 'credits') {
            c.fillStyle = 'rgba(0,0,0,0.7)';
            c.fillRect(0, 0, this.canvas.width, this.canvas.height);

            c.textAlign = 'center';
            c.textBaseline = 'middle';

            c.font = '40px GameFont';
            c.fillStyle = 'white';

            c.fillText(
                'CRÉDITOS',
                this.canvas.width / 2,
                this.canvas.height / 2 - 60
            );

            c.font = '25px GameFont';
            c.fillText(
                'Desarrollado por Thelmo-SM',
                this.canvas.width / 2,
                this.canvas.height / 2
            );

            c.fillText(
                'Desarrollador Web',
                this.canvas.width / 2,
                this.canvas.height / 2 + 40
            );

            c.font = '18px GameFont';
            c.fillText(
                'Presiona ENTER para volver',
                this.canvas.width / 2,
                this.canvas.height / 2 + 100
            );

            return;
        }

        // =========================
        // 🔥 TÍTULO
        // =========================
        const marginLeft = 100;
        const titleY = 230;

        c.textAlign = 'left';
        c.textBaseline = 'middle';

        c.font = '90px GameFont';
        c.fillStyle = 'gray';

        c.strokeStyle = 'black';
        c.lineWidth = 10;

        c.strokeText('GORGAN', marginLeft, titleY);
        c.fillText('GORGAN', marginLeft, titleY);

        // =========================
        // 🔥 OPCIONES
        // =========================
        const startY = this.canvas.height / 2 - (this.options.length * 40);

        this.options.forEach((option, index) => {
            const isSelected = index === this.selectedIndex;

            const x = marginLeft;
            const y = startY + index * 80;

            let alpha = 0.1;

            if (isSelected) {
                alpha = 0.5 + Math.sin(this.blinkFrame * 0.1) * 0.1;
            }

            c.textAlign = 'left';
            c.textBaseline = 'middle';

            c.font = isSelected ? '45px GameFont' : '35px GameFont';

            c.fillStyle = isSelected
                ? `rgba(58, 30, 50, ${alpha})`
                : 'rgba(165, 156, 156, 0.84)';

            c.strokeStyle = 'black';
            c.lineWidth = 4;

            c.strokeText(option, x, y);
            c.fillText(option, x, y);
        });
    }

    drawBackground() {
        const c = this.c;

        if (this.backgroundLoaded) {
            c.drawImage(
                this.backgroundImage,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
        } else {
            c.fillStyle = '#0a0a0a';
            c.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}