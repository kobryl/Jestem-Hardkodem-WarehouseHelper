import Row from "./Row.js";

const HALL_ROW_COUNT = 7;
const HALL_HALF_ROW_COUNT = 3;

export default class Hall {
    // gridX and gridY correspond to the hall position, e.g. [0, 0] would be in the top left corner
    constructor(gridX, gridY, number, hasOffice, hasDelivery) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.number = number;
        this.hasOffice = hasOffice;
        this.hasDelivery = hasDelivery;

        this.rows = [];
        for (let i = 1; i <= HALL_ROW_COUNT; i++) {
            let isReversed = (i + 1) % 2;
            if (this.hasOffice || this.hasDelivery) {
                if (i > HALL_ROW_COUNT - HALL_HALF_ROW_COUNT) {
                    this.rows.push(new Row(i, true, isReversed));
                }
                else {
                    this.rows.push(new Row(i, false, isReversed));
                }
            }
            else {
                this.rows.push(new Row(i, false, isReversed));
            }
        }
    }

    get label() {
        return "H" + this.number;
    }

    get rowCount() {
        return this.rows.length;
    }

    get fullRowCount() {
        let r = 0;
        this.rows.forEach((row) => {
            if (!row.isHalfRow) r++;
        });
        return r;
    }

    get halfRowCount() {
        let r = 0;
        this.rows.forEach((row) => {
            if (row.isHalfRow) r++;
        });
        return r;
    }
}