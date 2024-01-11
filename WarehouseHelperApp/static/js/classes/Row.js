import Shelf from "./Shelf.js";

const ROW_SHELF_COUNT = 16;
const HALF_ROW_SHELF_COUNT = 8;

export default class Row {
    constructor(number, isHalfRow, isReversed=false) {
        this.number = number;
        this.isHalfRow = isHalfRow;
        this.isReversed = isReversed;
        this.shelfCount = this.isHalfRow ? HALF_ROW_SHELF_COUNT : ROW_SHELF_COUNT;
        
        this.upperShelves = [];
        this.lowerShelves = [];
        if (!this.isReversed) {
            for (let i = 1; i <= this.shelfCount; i += 2) {
                this.upperShelves.push(new Shelf(i));
                this.lowerShelves.push(new Shelf(i + 1));
            }
        }
        else {
            for (let i = this.shelfCount; i > 0; i -= 2) {
                this.upperShelves.push(new Shelf(isHalfRow ? i + HALF_ROW_SHELF_COUNT : i));
                this.lowerShelves.push(new Shelf(isHalfRow ? i - 1 + HALF_ROW_SHELF_COUNT : i - 1));
            }
        }
    }

    get label() {
        if (this.number < 10) return "0" + this.number;
        else return this.number;
    }

    get shelves() {
        let s = [];
        for (let i = 0; i < this.shelfCount; i++) {
            s.push(this.upperShelves[i]);
            s.push(this.lowerShelves[i]);
        }
        return s;
    }
}