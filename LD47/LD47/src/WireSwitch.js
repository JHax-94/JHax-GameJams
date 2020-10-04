import Component from "./Component";
import { consoleLog, GetWireSwitchDirFromFlips, GetWireSwitchDirFromDir } from "./main";

export default class WireSwitch extends Component
{
    constructor(tilePos, spriteData, wireSwitch)
    {
        super(tilePos, spriteData, "WIRE_SWITCH");

        this.dirs = [ "H", "V" ];

        this.chargesRequired = wireSwitch.chargesRequired;
        this.resetOnFullyCharged = true;

        var map = GetWireSwitchDirFromFlips(spriteData.flipX, spriteData.flipY, spriteData.flipR);

        this.currentDirIndex = this.GetDirectionIndex(map.dir);
    }

    CurrentDirection()
    {
        return this.dirs[this.currentDirIndex];
    }

    GetDirectionIndex(dir)
    {
        var index = -1;

        for(var i = 0; i < this.dirs.length; i ++)
        {
            if(this.dirs[i] === dir)
            {
                index = i;
                break;
            }
        }

        if(index < 0) consoleLog("Something bad has happened in WireSwitch");

        return index;
    }

    AllowPassage(electron)
    {
        var passageAllowed = false;
        
        if(this.CurrentDirection() === "H")
        {
            passageAllowed = Math.abs(electron.phys.velocity[0]) > 0;
        }
        else if(this.CurrentDirection() === "V")
        {
            passageAllowed = Math.abs(electron.phys.velocity[1]) > 0;
        }
        
        return passageAllowed;
    }

    ChangeDirection()
    {
        this.currentDirIndex = (this.currentDirIndex + 1) % this.dirs.length;

        var flipMap = GetWireSwitchDirFromDir(this.CurrentDirection());

        this.spriteInfo.flipX = flipMap.flipX;
        this.spriteInfo.flipY = flipMap.flipY;
        this.spriteInfo.flipR = flipMap.flipR;
    }

    Charged()
    {
        this.ChangeDirection();
    }
}