import { Player } from './player';
import { Timer } from './timer';
import { Logic } from './logic';
import { Guesses } from './guesses';
import { Guess } from './guess';
import { Toplist} from "./toplist";
import { Restart} from "./restart";

export class Game {
    constructor() {
        this.timer = new Timer();
        this.player = new Player();
        this.logic = new Logic(this);
        this.guesses = new Guesses();
        this.guess = new Guess(this);
        this.toplist = new Toplist();
        this.restart = new Restart(this);

        this.player.onNameSet.then(() => this.start());

        this.components = [this.timer, this.player, this.logic, this.guesses, this.guess, this.toplist, this.restart];

        this.render();
    }

    render() {
        this.components.map(c => c && typeof (c.render) === 'function' && c.render());
    }

    start() {
        this.timer.start();
        this.guess.setEnabled(true);
        this.logic.startGame();
    }

    onGuessed(num, guess) {
        this.guesses.addGuess(num, guess);
        if (guess === 'correct') {
            this.guess.setEnabled(false);
            this.timer.stop();
            this.toplist.setItem(this.player.name, this.guesses.guesses.length, this.timer.getElapsedTime());
            this.restart.setHide(false);
        }
    }

    onGuessing(num) {
        this.logic.guess(num);
    }

    onRestart() {
        this.guesses.clear();
        this.timer.clear();
        this.restart.setHide(true);
        this.player.clear();
        this.player.enableInput();
        this.player.setFocus();
        document.getElementById('start-button').addEventListener('click', e => {
            this.player = new Player();
            this.player.onNameSet.then(() => this.start());
        });
    }
}