import Obstacle from "./Obstacle";
import { EM } from "./main";

export default class BerryBush extends Obstacle
{
    constructor(pos, type)
    {
        super(pos, type);
    }

    DeleteBeast()
    {
        EM.RemoveEntity(this);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(33, screenPos.x, screenPos.y);
    }
}
