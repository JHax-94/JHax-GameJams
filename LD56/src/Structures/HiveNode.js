import Structure from "./Structure";

export default class HiveNode extends Structure
{
    constructor(pos)
    {
        super(pos);
        this.maxPopulation = 50;

        this.spriteIndex = 2;
    }
}
