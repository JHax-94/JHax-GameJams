import Obstacle from "./Obstacle";
import { EM } from "./main";

export default class Block extends Obstacle
{
    constructor(pos)
    {
        super(pos, "block");
    }

    GetItemName()
    {
        return "Block";
    }

    DeleteBeast()
    {
        EM.RemoveEntity(this);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(8, screenPos.x, screenPos.y);
    }

}
