// DOM
const WAREHOUSE_SVG_ID = "warehouse";
const SHELF_CLASS = "shelf";
const HALL_CLASS = "hall";
const OFFICE_CLASS = "office";
const DELIVERY_CLASS = "delivery";
const DOOR_CLASS = "door";
const LABEL_CLASS = "label";
const ADDITIONAL_ROOM_LABEL_CLASS = "addroom-label";
const HALL_LABEL_CLASS = "hall-label";
const ROW_LABEL_CLASS = "row-label";
const SHELF_LABEL_CLASS = "shelf-label";

// Drawing: SVG elements
const SVG_VIEW_WIDTH = 560;          // px
const SVG_VIEW_HEIGHT = 900;         // px
const SVG_ASPECT_RATIO = SVG_VIEW_WIDTH / SVG_VIEW_HEIGHT;
const SVG_DEFAULT_ZOOM_CONSTRAINTS = [1, 5];            // [min, max] scales
const SVG_TRANSLATE_CONSTRAINTS = [[0, 0], [SVG_VIEW_WIDTH, SVG_VIEW_HEIGHT]];            // [[min, max]_1, [min, max]_2]
const SVG_MARGIN = 24;                   // px

// Drawing: Warehouse sizes
const HALL_GRID_X_SIZE = 2;
const HALL_GRID_Y_SIZE = 3;
const HALL_WIDTH = SVG_VIEW_WIDTH / HALL_GRID_X_SIZE;
const HALL_HEIGHT = SVG_VIEW_HEIGHT / HALL_GRID_Y_SIZE;
const SHELVES_PER_COLUMN = 4;
const COLUMN_MARGIN = 14;           // px
const SHELF_WIDTH = 28;             // px
const SHELF_HEIGHT = 12.13;         // px
const SHELF_SPACING = 18.67;        // px
const OFFICE_WIDTH = 126;           // px
const OFFICE_HEIGHT = 141;          // px
const DELIVERY_WIDTH = 126;         // px
const DELIVERY_HEIGHT = 141;        // px
const HORIZONTAL_DOOR_SIZE = 2 * COLUMN_MARGIN;
const VERTICAL_DOOR_SIZE = SHELF_SPACING;
const DOOR_THICKNESS = 4;           // px
const DOOR_INSET = 2;               // px
const FIRST_VERTICAL_DOOR_ROW = 2;
const SECOND_VERTICAL_DOOR_ROW = 5;
const ROW_HEIGHT = 2 * SHELF_HEIGHT + SHELF_SPACING;

// Drawing: Styles
const HALL_STROKE_COLOR = "black";
const HALL_STROKE_WIDTH = 3;                // px
const HALL_FILL_COLOR = "transparent";
const SHELF_STROKE_COLOR = "black";
const SHELF_STROKE_WIDTH = 1;               // px
const SHELF_FILL_COLOR = "transparent";
const OFFICE_STROKE_COLOR = "#266BDD";
const OFFICE_STROKE_WIDTH = 2;              // px
const OFFICE_FILL_COLOR = "#D4E2FA";
const DELIVERY_STROKE_COLOR = "#E69D3F";
const DELIVERY_STROKE_WIDTH = 2;            // px
const DELIVERY_FILL_COLOR = "#F8DEBE";
const DOOR_FILL_COLOR = "white";
const ROW_LABEL_COLOR = "#aaa";
const SHELF_LABEL_COLOR = "#aaa";
const POINT_COLOR = "#ccc";
const LINE_COLOR = "red";
const LINE_WIDTH = 2;

// Drawing: Labels
const OFFICE_LABEL = "OFFICE";
const DELIVERY_LABEL = "DELIVERY";
const HALL_LABEL_ROW = 4;