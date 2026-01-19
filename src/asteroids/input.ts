export default class Input {
    public keys = {
        w: false,
        a: false,
        d: false,
        space: false,
        shiftLeft: false,
    }
    
    constructor() {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    handleKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case "KeyW":
                this.keys.w = true;
                break;
            case "KeyA":
                this.keys.a = true;
                break;
            case "KeyD":
                this.keys.d = true;
                break;
            case "Space":
                this.keys.space = true;
                break;
            case "ShiftLeft":
                this.keys.shiftLeft = true;
                break;
        }
    }

    handleKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case "KeyW":
                this.keys.w = false;
                break;
            case "KeyA":
                this.keys.a = false;
                break;
            case "KeyD":
                this.keys.d = false;
                break;
            case "Space":
                this.keys.space = false;
                break;
            case "ShiftLeft":
                this.keys.shiftLeft = false;
                break;
        }
    }
}
