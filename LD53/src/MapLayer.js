import { EM } from "./main";

export default class MapLayer
{
    constructor(map)
    {
        this.map = map;
        EM.RegisterEntity(this);
    }

    Draw()
    {
        this.map.draw(0, 0);
    }
}