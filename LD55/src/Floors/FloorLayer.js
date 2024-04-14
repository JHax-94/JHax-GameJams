export default class FloorLayer
{
    constructor(number, y)
    {
        this.number = number;
        this.y = y;
        this.floors = [];
    }

    AddFloor(floor)
    {
        this.floors.push(floor);
    }
}