import { EM, PIXEL_SCALE } from "../main";
import Structure from "./Structure";

export default class StartHive extends Structure
{
    constructor(pos)
    {
        super(pos);
        this.maxPopulation = 2;
        this.population = this.maxPopulation;

        this.deadSprite = 81;
        this.isConnected = true;

        EM.AddEntity("START_HIVE", this);
    }

    DrawHighlight(screenPos)
    {
        sprite(17, screenPos.x, screenPos.y);
        sprite(33, screenPos.x, screenPos.y - PIXEL_SCALE);
        sprite(65, screenPos.x, screenPos.y + PIXEL_SCALE);
        sprite(49, screenPos.x - PIXEL_SCALE, screenPos.y, true);
        sprite(49, screenPos.x + PIXEL_SCALE, screenPos.y);
    }
}