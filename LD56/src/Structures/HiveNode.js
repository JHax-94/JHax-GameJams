import Structure from "./Structure";

export default class HiveNode extends Structure
{
    constructor(pos)
    {
        super(pos);
        this.maxPopulation = 50;

        this.maxReplenishTime = 6;

        this.deadSprite = 34;
        this.spriteIndex = 2;
    }

    DrawHighlight(screenPos)
    {
        sprite(18, screenPos.x, screenPos.y);
    }
}
