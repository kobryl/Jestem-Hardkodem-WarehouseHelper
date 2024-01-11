export default class Item {
    constructor(id, x, y, z, sizeX, sizeY, sizeZ, up="+y") {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.sizeZ = sizeZ;
        this.up = up;
    }
}