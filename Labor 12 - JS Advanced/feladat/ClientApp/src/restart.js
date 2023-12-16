export class Restart {
    constructor(game) {
        this.game = game;
        document.getElementById('restart-button').addEventListener('click', e => {
            e.preventDefault();
            game.onRestart();
        });
        this.setHide(true);
    }

    setHide(value) {
        this.hide = !!value;
        this.render();
    }

    render() {
        document.getElementById('restart-button').hidden = this.hide;
    }
}