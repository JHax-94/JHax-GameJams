import Component from "./Component";
import { UP, DOWN, RIGHT, LEFT, consoleLog, GetDiodeDirMapFromFlips } from "./main";

export default class Diode extends Component
{
    constructor(tilePos, spriteData)
    {
        super(tilePos, spriteData, "DIODE");

        this.direction = GetDiodeDirMapFromFlips(spriteData.flipX, spriteData.flipY, spriteData.flipR).dir;

        consoleLog("==== DIODE CONSTRUCTED ====");
        consoleLog(this);
    }

    AllowPassage(electron)
    {
        var allowed = false;

        consoleLog("Check Diode Passage:");
        consoleLog(this.direction);
        consoleLog(electron.phys.velocity);

        if(this.direction === UP && electron.phys.velocity[1] > 0) allowed = true;
        else if(this.direction === DOWN && electron.phys.velocity[1] < 0) allowed = true;
        else if(this.direction === LEFT && electron.phys.velocity[0] < 0) allowed = true;
        else if(this.direction === RIGHT && electron.phys.velocity[0] > 0) allowed = true; 

        return allowed;
    }
}