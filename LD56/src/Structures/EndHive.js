import Structure from "./Structure";

export default class EndHive extends Structure
{
    constructor(pos)
    {
        super(pos);
        this.spriteIndex = 4;
        this.isEndHive = true;
    }

    CanAddSource() { return true; }

    IsValidSource() { return false; }
    
    ReplenishUpdate(deltaTime) {}
}