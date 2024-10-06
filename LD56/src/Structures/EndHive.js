import Structure from "./Structure";

export default class EndHive extends Structure
{
    constructor(pos)
    {
        super(pos);

        this.maxPopulation = 100;
        this.spriteIndex = 4;
        this.isEndHive = true;
    }

    CanAddSource() { return true; }

    IsValidSource() { return false; }
    
    ReplenishUpdate(deltaTime) {}

    Update(deltaTime)
    {
        super.Update(deltaTime);

        if(this.population === this.maxPopulation)
        {
            this.GameWorld().Victory();
        }
    }
}