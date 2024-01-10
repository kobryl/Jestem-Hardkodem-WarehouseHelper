const ROW_SHELF_COUNT = 16;
const HALF_ROW_SHELF_COUNT = 8;

export default class Row {
    constructor(number, isHalfRow) {
        this.number = number;
        this.isHalfRow = isHalfRow;
    }

    get label() {
        if (number < 10) return "0" + this.number;
        else return this.number;
    }

    get shelfCount() {
        if (this.isHalfRow) return HALF_ROW_SHELF_COUNT;
        else return ROW_SHELF_COUNT;
    }
}