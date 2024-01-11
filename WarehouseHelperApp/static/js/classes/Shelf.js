export default class Shelf {
    constructor(number) {
        this.number = number;
    }

    get label() {
        if (this.number < 10) return "0" + this.number;
        else return this.number;
    }
}