import { EM } from "../main";
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

    DrawWarning()
    {
        let screenPos = this.GetScreenPos();

        sprite(50, screenPos.x, screenPos.y);
    }
    /*
    Update(deltaTime)
    {
        super.Update(deltaTime);
        if(this.population >= 10)
        {
            this.SelfDestruct();
        }
    }

    SelfDestruct()
    {
        this.population = 0;
        this.Kill();
    }*/

    SpawnTimeRemaining()
    {
        let spawnTimeRemaining = super.SpawnTimeRemaining();

        let factor = this.population / this.maxPopulation;

        let returnTime = spawnTimeRemaining + (1-factor) * spawnTimeRemaining;

        //EM.hudLog.push(`Node ${this.population}/${this.maxPopulation} - ${factor.toFixed(3)} - T: ${returnTime} - t: ${spawnTimeRemaining}`);

        return returnTime;
    }
}
