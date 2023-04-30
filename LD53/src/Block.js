import Obstacle from "./Obstacle";

export default class Block extends Obstacle
{
    constructor(pos)
    {
        super(pos, "block");
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(8, screenPos.x, screenPos.y);
    }

}