import Component from "./Component";
import { consoleLog } from "./main";

export default class Wire extends Component
{
    constructor(tilePos, spriteData)
    {
        super(tilePos, spriteData);

        this.logName = "WIRE";
        this.logging = true;

        this.railPoint = null;
    }

    SetRailPoint(railPoint)
    {
        this.railPoint = railPoint;
    }

    MoveToTile(newTile)
    {
        super.MoveToTile(newTile);

        if(this.railPoint != null)
        {
            this.railPoint.tilePos.x = this.tilePos.x;
            this.railPoint.tilePos.y = this.tilePos.y;
            this.railPoint.phys.position = this.GetPhysPosition();
        }
    }
}