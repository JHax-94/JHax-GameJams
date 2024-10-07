import { vec2 } from "p2";
import { EM } from "../main";
import Structure from "./Structure";

export default class EndHive extends Structure
{
    constructor(pos)
    {
        super(pos);

        this.maxPopulation = 100;
        this.spriteIndex = 4;
        this.isEndHive = true;
        this.startHive = EM.GetEntity("START_HIVE");

        this.player = null;
    }

    Player()
    {
        if(this.player === null)
        {
            this.player = EM.GetEntity("GAMEWORLD").player;
        }

        return this.player;
    }

    CanAddSource() { return true; }

    IsValidSource() { return false; }
    
    ReplenishUpdate(deltaTime) {}

    Update(deltaTime)
    {
        super.Update(deltaTime);

        
        EM.hudLog.push(`DIST: ${vec2.dist(this.phys.position, this.startHive.phys.position)}`);
        /*EM.hudLog.push(`PDIST: ${vec2.dist(this.phys.position, this.Player().phys.position)}`);
        */

        if(this.population === this.maxPopulation)
        {
            this.GameWorld().Victory();
        }
    }
}