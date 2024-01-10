import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import Hall from "./classes/Hall.js";


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


function handleZoom(e) {
    svgView.attr("transform", e.transform);
}

function handleWindowResize() {
    if (svgHeight != window.innerHeight) {
        resizeSvg(window.innerHeight - SVG_MARGIN * 2);
    }
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
        .attr("width", SVG_VIEW_WIDTH / HALL_GRID_X_SIZE)
        .attr("height", SVG_VIEW_HEIGHT / HALL_GRID_Y_SIZE)
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

function drawHall(hall) {
    let hallX = (SVG_VIEW_WIDTH / HALL_GRID_X_SIZE) * hall.gridX;
    let hallY = (SVG_VIEW_HEIGHT / HALL_GRID_Y_SIZE) * hall.gridY;

    hall.rows.forEach((row, rowIndex) => {
        for (let i = 0; i < row.shelfCount / 2; i++) {
            let x = hallX + COLUMN_MARGIN + SHELF_WIDTH * i;
            let y = hallY + (2 * SHELF_HEIGHT + SHELF_SPACING) * rowIndex;
            if (i >= SHELVES_PER_COLUMN) x += COLUMN_MARGIN * 2;
            drawShelf(x, y);
            drawShelf(x, y + SHELF_SPACING + SHELF_HEIGHT);
        }
    });

    let additionalRoomX = hallX + SHELVES_PER_COLUMN * SHELF_WIDTH + 3 * COLUMN_MARGIN;
    let additionalRoomY = hallY + (2 * SHELF_HEIGHT + SHELF_SPACING) * hall.fullRowCount - SHELF_HEIGHT;
    if (hall.hasOffice) drawOffice(additionalRoomX, additionalRoomY);
    if (hall.hasDelivery) drawDelivery(additionalRoomX, additionalRoomY);
    drawHallWalls(hallX, hallY);
}

function drawHalls(halls) {
    halls.forEach((hall) => {
        drawHall(hall);
    
        let hallX = (SVG_VIEW_WIDTH / HALL_GRID_X_SIZE) * hall.gridX;
        let hallY = (SVG_VIEW_HEIGHT / HALL_GRID_Y_SIZE) * hall.gridY;
    
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
