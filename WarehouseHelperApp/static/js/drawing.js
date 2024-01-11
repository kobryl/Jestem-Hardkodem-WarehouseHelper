import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import Hall from "./classes/Hall.js";
import { gridPoints } from "./gridPoints.js";
import PathPoint from "./classes/PathPoint.js";


let svg = d3.select("#" + WAREHOUSE_SVG_ID);
let svgView = d3.select("#" + WAREHOUSE_SVG_ID + " g");
let svgWidth = SVG_VIEW_WIDTH;
let svgHeight = SVG_VIEW_HEIGHT;
let svgScale = 1;
let zoom = d3.zoom()
    .scaleExtent(SVG_DEFAULT_ZOOM_CONSTRAINTS)
    .translateExtent(SVG_TRANSLATE_CONSTRAINTS);

let halls = [
    new Hall(1, 0, 1, true, false),
    new Hall(0, 1, 2, false, false),
    new Hall(1, 1, 3, false, false),
    new Hall(0, 2, 4, false, false),
    new Hall(1, 2, 5, false, true)
]

let pathGrid = [];
gridPoints.forEach((point) => {
    pathGrid.push(new PathPoint(point[0], point[1], point[2], point[3]));
});

let drawLabels = true;


function handleZoom(e) {
    svgView.attr("transform", e.transform);
}

function handleWindowResize() {
    if (svgHeight != window.innerHeight) {
        resizeSvg(window.innerHeight - SVG_MARGIN * 2);
    }
}

function clearSvg() {
    svgView.selectAll("rect").remove();
}

function resizeSvg(height) {
    if (height <= SVG_VIEW_HEIGHT) {
        svgHeight = height;
        svgWidth = svgHeight * SVG_ASPECT_RATIO;
        svgScale = svgHeight / SVG_VIEW_HEIGHT;

        svg.attr("width", svgWidth)
            .attr("height", svgHeight);
        svgView.attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("transform", "translate(0,0) scale(" + svgScale + ")");
        
        
        zoom.scaleExtent([svgScale, SVG_DEFAULT_ZOOM_CONSTRAINTS[1]])
            .translateExtent(SVG_TRANSLATE_CONSTRAINTS);
        svg.call(zoom.transform, d3.zoomIdentity.scale(svgScale));
    }
}

function initSvg() {
    svgView.attr("transform", "translate(0,0) scale(1)");
    svg.call(
        zoom.on("zoom", handleZoom)
    );
    resizeSvg(window.innerHeight - SVG_MARGIN * 2);
}

function drawLabel(x, y, text, classes=null, color=null) {
    let classNames = LABEL_CLASS;
    if (classes != null) classes.forEach((c) => classNames += " " + c);
    svgView.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("fill", color != null ? color : "black")
        .attr("class", classNames)
        .text(text);
}

function drawShelf(x, y) {
    svgView.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", SHELF_WIDTH)
        .attr("height", SHELF_HEIGHT)
        .attr("class", SHELF_CLASS)
        .attr("stroke", SHELF_STROKE_COLOR)
        .attr("stroke-width", SHELF_STROKE_WIDTH)
        .attr("fill", SHELF_FILL_COLOR);
}

function drawHallWalls(x, y) {
    svgView.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", HALL_WIDTH)
        .attr("height", HALL_HEIGHT)
        .attr("class", HALL_CLASS)
        .attr("stroke", HALL_STROKE_COLOR)
        .attr("stroke-width", HALL_STROKE_WIDTH)
        .attr("fill", HALL_FILL_COLOR);
}

function drawOffice(x, y) {
    svgView.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", OFFICE_WIDTH)
        .attr("height", OFFICE_HEIGHT)
        .attr("class", OFFICE_CLASS)
        .attr("stroke", OFFICE_STROKE_COLOR)
        .attr("stroke-width", OFFICE_STROKE_WIDTH)
        .attr("fill", OFFICE_FILL_COLOR);

    if (drawLabels) {
        drawLabel(x + OFFICE_WIDTH / 2, y + OFFICE_HEIGHT / 2, OFFICE_LABEL, [ADDITIONAL_ROOM_LABEL_CLASS]);
    }
}

function drawDelivery(x, y) {
    svgView.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", DELIVERY_WIDTH)
        .attr("height", DELIVERY_HEIGHT)
        .attr("class", DELIVERY_CLASS)
        .attr("stroke", DELIVERY_STROKE_COLOR)
        .attr("stroke-width", DELIVERY_STROKE_WIDTH)
        .attr("fill", DELIVERY_FILL_COLOR);
        
    if (drawLabels) {
        drawLabel(x + DELIVERY_WIDTH / 2, y + DELIVERY_HEIGHT / 2, DELIVERY_LABEL, [ADDITIONAL_ROOM_LABEL_CLASS])
    }
}

function drawHorizontalDoor(x, y) {
    svgView.append("rect")
        .attr("x", x + DOOR_THICKNESS / 2 + DOOR_INSET)
        .attr("y", y)
        .attr("width", HORIZONTAL_DOOR_SIZE - DOOR_THICKNESS - DOOR_INSET * 2)
        .attr("height", 1)
        .attr("class", DOOR_CLASS)
        .attr("stroke", DOOR_FILL_COLOR)
        .attr("stroke-width", DOOR_THICKNESS)
        .attr("fill", DOOR_FILL_COLOR);
}

function drawVerticalDoor(x, y) {
    svgView.append("rect")
        .attr("x", x)
        .attr("y", y + DOOR_THICKNESS / 2 + DOOR_INSET)
        .attr("width", 1)
        .attr("height", VERTICAL_DOOR_SIZE - DOOR_THICKNESS - DOOR_INSET * 2)
        .attr("class", DOOR_CLASS)
        .attr("stroke", DOOR_FILL_COLOR)
        .attr("stroke-width", DOOR_THICKNESS)
        .attr("fill", DOOR_FILL_COLOR);
}

function drawGridPoint(x, y) {
    svgView.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 1)
        .attr("stroke", "transparent")
        .attr("style", "fill: " + POINT_COLOR);
}

function drawPath(x1, y1, x2, y2, arrowPoints) {
    svgView.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", LINE_COLOR)
        .attr("stroke-width", LINE_WIDTH);
    svgView.append("polygon")
        .attr("points", arrowPoints)
        .attr("style", "fill:red;stroke:transparent;stroke-width:1");
}

function drawHall(hall) {
    let hallX = HALL_WIDTH * hall.gridX;
    let hallY = HALL_HEIGHT * hall.gridY;

    hall.rows.forEach((row, rowIndex) => {
        row.upperShelves.forEach((shelf, shelfIndex) => {
            let x = hallX + COLUMN_MARGIN + SHELF_WIDTH * shelfIndex;
            let y = hallY + ROW_HEIGHT * rowIndex;
            if (shelfIndex >= SHELVES_PER_COLUMN) x += COLUMN_MARGIN * 2;
            drawShelf(x, y);

            if (drawLabels) {
                drawLabel(x + SHELF_WIDTH / 2, y + SHELF_HEIGHT * 5 / 7, shelf.label, [SHELF_LABEL_CLASS], SHELF_LABEL_COLOR);
            }
        })
        row.lowerShelves.forEach((shelf, shelfIndex) => {
            let x = hallX + COLUMN_MARGIN + SHELF_WIDTH * shelfIndex;
            let y = hallY + ROW_HEIGHT * rowIndex + SHELF_SPACING + SHELF_HEIGHT;
            if (shelfIndex >= SHELVES_PER_COLUMN) x += COLUMN_MARGIN * 2;
            drawShelf(x, y);

            if (drawLabels) {
                drawLabel(x + SHELF_WIDTH / 2, y + SHELF_HEIGHT * 5 / 7, shelf.label, [SHELF_LABEL_CLASS], SHELF_LABEL_COLOR);
            }
        })

        if (drawLabels) {
            let labelX = hallX + COLUMN_MARGIN * 2 + SHELF_WIDTH * SHELVES_PER_COLUMN;
            let labelY = hallY + SHELF_HEIGHT * 2 + ROW_HEIGHT * rowIndex;
            drawLabel(labelX, labelY, row.label, [ROW_LABEL_CLASS], ROW_LABEL_COLOR);    
        }
    });

    let additionalRoomX = hallX + SHELVES_PER_COLUMN * SHELF_WIDTH + 3 * COLUMN_MARGIN;
    let additionalRoomY = hallY + ROW_HEIGHT * hall.fullRowCount - SHELF_HEIGHT;
    if (hall.hasOffice) drawOffice(additionalRoomX, additionalRoomY);
    if (hall.hasDelivery) drawDelivery(additionalRoomX, additionalRoomY);
    drawHallWalls(hallX, hallY);

    if (drawLabels) {
        drawLabel(hallX + HALL_WIDTH / 2, hallY + ROW_HEIGHT * HALL_LABEL_ROW, hall.label, [HALL_LABEL_CLASS]);
    }
}

function drawHalls(halls) {
    halls.forEach((hall) => {
        drawHall(hall);

        let hallX = HALL_WIDTH * hall.gridX;
        let hallY = HALL_HEIGHT * hall.gridY;
    
        halls.forEach((otherHall) => {
            if (hall.gridX == otherHall.gridX && hall.gridY == otherHall.gridY + 1) {
                let doorX = hallX + SHELF_WIDTH * SHELVES_PER_COLUMN + COLUMN_MARGIN;
                let doorY = hallY;
                drawHorizontalDoor(doorX, doorY);
            }
            if (hall.gridX == otherHall.gridX + 1 && hall.gridY == otherHall.gridY) {
                let doorX = hallX;
                let doorY1 = hallY + (FIRST_VERTICAL_DOOR_ROW - 1) * (SHELF_HEIGHT * 2 + SHELF_SPACING) + SHELF_HEIGHT;
                let doorY2 = hallY + (SECOND_VERTICAL_DOOR_ROW - 1) * (SHELF_HEIGHT * 2 + SHELF_SPACING) + SHELF_HEIGHT;
                drawVerticalDoor(doorX, doorY1);
                drawVerticalDoor(doorX, doorY2);
            }
        });
    });
}


initSvg();
window.addEventListener("resize", handleWindowResize);
drawHalls(halls);
pathGrid.forEach((point) => {
    drawGridPoint(point.x, point.y);
});

let path = "1 0 2 0 3 0 4 0 5 0 6 0 7 0 7 1 7 2 7 3 7 4 7 5 7 6 7 7 7 8 7 9 7 10 7 11 8 11 9 11 10 11 11 11 12 11 13 11 13 12 13 13 13 14 13 15 13 16 13 17 13 18 13 19 13 20 13 21 14 21 15 21 16 21 16 20 16 19 16 18 17 18 16 18 16 17 16 16 15 16 14 16 13 16 12 16 11 16 10 16 10 15 10 14 10 13 10 12 10 11 9 11 8 11 7 11 7 10 6 10 5 10 4 10 4 9 4 8 4 7 4 6 4 5 3 5 2 5 1 5 1 6 1 7 1 8 1 9 2 9 1 9 1 10 2 10 3 10 4 10 5 10 6 10 7 10 8 10 9 10 10 10 11 10 12 10 13 10 14 10 15 10 16 10 16 11 17 11 18 11 19 11 19 12 19 13 19 14 19 15 18 15 19 15 19 16 18 16 17 16 16 16 16 15 16 14 16 13 16 12 16 11 15 11 14 11 13 11 13 12 13 13 13 14 13 15 14 15 13 15 13 16 14 16 15 16 16 16 16 15 16 14 16 13 16 12 16 11 16 10 16 9 16 8 16 7 16 6 16 5 17 5 18 5 19 5 19 6 19 7 20 7 19 7 19 8 19 9 19 10 18 10 17 10 16 10 15 10 14 10 13 10 12 10 11 10 10 10 9 10 8 10 7 10 6 10 5 10 4 10 4 9 4 8 4 7 4 6 4 5 4 4 4 3 4 2 4 1 4 0 3 0 2 0 1 0 1 1 1 2 0 2 1 2 1 3 1 4 1 5 2 5 3 5 4 5 5 5 6 5 7 5 7 6 7 7 7 8 7 9 7 10 7 11 7 12 7 13 6 13 7 13 7 14 7 15 7 16 8 16 9 16 10 16 11 16 12 16 13 16 14 16 15 16 16 16 17 16 18 16 19 16 20 16 21 16 22 16 23 16 24 16 25 16 25 15 25 14 25 13 25 12 25 11 26 11 27 11 28 11 28 10 29 10 30 10 31 10 31 9 31 8 31 7 31 6 31 5 31 4 31 3 31 2 31 1 31 0 32 0 33 0 34 0 34 1 34 2 34 3 34 4 33 4 34 4 34 5 33 5 32 5 31 5 30 5 29 5 28 5 28 6 28 7 28 8 28 9 28 10 28 11 28 12 28 13 28 14 28 15 28 16 27 16 26 16 25 16 25 15 25 14 24 14 25 14 25 13 25 12 25 11 24 11 23 11 22 11 22 12 22 13 22 14 22 15 22 16 22 17 22 18 22 19 23 19 24 19 25 19 26 19 25 19 25 18 25 17 24 17 24 16 23 16 22 16 21 16 20 16 19 16 18 16 17 16 16 16 16 15 16 14 16 13 16 12 16 11 15 11 14 11 13 11 13 12 13 13 12 13 13 13 13 14 13 15 13 16 12 16 11 16 10 16 10 15 10 14 10 13 10 12 10 11 9 11 8 11 7 11 7 10 6 10 5 10 4 10 4 9 4 8 4 7 4 6 4 5 4 4 4 3 4 2 4 1 4 0 3 0 2 0 1 0 1 1 1 2 1 3 1 4 0 4 1 4 1 5 2 5 3 5 4 5 5 5 6 5 7 5 8 5 9 5 10 5 11 5 12 5 13 5 14 5 15 5 16 5 17 5 18 5 19 5 19 6 19 7 19 8 19 9 18 9 19 9 19 10 18 10 17 10 16 10 16 9 16 8 16 7 16 6 16 5 15 5 14 5 13 5 13 6 13 7 13 8 13 9 12 9 13 9 13 10 12 10 11 10 10 10 10 9 10 8 10 7 10 6 10 5 10 4 10 3 10 2 10 1 10 0 11 0 12 0 13 0 13 1 13 2 13 3 13 4 12 4 13 4 13 5 14 5 15 5 16 5 17 5 18 5 19 5 20 5 21 5 22 5 23 5 24 5 25 5 26 5 27 5 28 5 29 5 30 5 31 5 32 5 33 5 34 5 34 6 34 7 34 8 34 9 34 10 35 10 36 10 37 10 37 9 37 8 37 7 36 7";
let pathIndices = path.split(" ");
for (let i = 0; i < pathIndices.length - 2; i += 2) {
    let ix1 = parseInt(pathIndices[i]);
    let iy1 = parseInt(pathIndices[i + 1]);
    let ix2 = parseInt(pathIndices[i + 2]);
    let iy2 = parseInt(pathIndices[i + 3]);
    let p1, p2;
    for (let j = 0; j < pathGrid.length; j++) {
        if (pathGrid[j].ix == ix1 && pathGrid[j].iy == iy1) {
            p1 = pathGrid[j];
        }
        if (pathGrid[j].ix == ix2 && pathGrid[j].iy == iy2) {
            p2 = pathGrid[j];
        }
    }
    let arrowPoints;
    if (ix2 > ix1) arrowPoints = p2.x + "," + (SVG_VIEW_HEIGHT - p2.y) + " " + (p2.x - 4) + "," + (SVG_VIEW_HEIGHT - p2.y + 4) + " " + (p2.x + 4) + "," + (SVG_VIEW_HEIGHT - p2.y + 4);
    else if (ix2 < ix1) arrowPoints = p2.x + "," + (SVG_VIEW_HEIGHT - p2.y) + " " + (p2.x - 4) + "," + (SVG_VIEW_HEIGHT - p2.y - 4) + " " + (p2.x + 4) + "," + (SVG_VIEW_HEIGHT - p2.y - 4);
    else if (iy2 > iy1) arrowPoints = p2.x + "," + (SVG_VIEW_HEIGHT - p2.y) + " " + (p2.x - 4) + "," + (SVG_VIEW_HEIGHT - p2.y - 4) + " " + (p2.x - 4) + "," + (SVG_VIEW_HEIGHT - p2.y + 4);
    else if (iy2 < iy1) arrowPoints = p2.x + "," + (SVG_VIEW_HEIGHT - p2.y) + " " + (p2.x + 4) + "," + (SVG_VIEW_HEIGHT - p2.y + 4) + " " + (p2.x + 4) + "," + (SVG_VIEW_HEIGHT - p2.y - 4);
    drawPath(p1.x, SVG_VIEW_HEIGHT - p1.y, p2.x, SVG_VIEW_HEIGHT - p2.y, arrowPoints);
}
