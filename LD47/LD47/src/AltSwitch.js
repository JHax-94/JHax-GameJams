import Component from "./Component"
import { consoleLog, GetAltSwitchDirMapFromDir, UP, DOWN, LEFT, RIGHT } from "./main";

export default class AltSwitch extends Component
{
    constructor(tilePos, spriteData, altSwitch)
    {
        spriteData.flipH = altSwitch.flipX;
        spriteData.flipV = altSwitch.flipY;
        spriteData.flipR = altSwitch.flipR;

        super(tilePos, spriteData, "POWERED_ALT");
        
        this.dirMaps = [ GetAltSwitchDirMapFromDir(altSwitch.dir), GetAltSwitchDirMapFromDir(altSwitch.alt) ];
        this.chargesRequired = altSwitch.chargesRequired;
        this.currentMap = 0;

        consoleLog("Alt Switch constructed:");
        consoleLog(this);

        this.SwitchDirection(0);
    }

    GetFlippedDirection()
    {
        var vector = [0, 0];
        
        var currentDir = this.dirMaps[this.currentMap].setDir;

        if(currentDir === UP) vector[1] = 1;
        else if(currentDir === DOWN) vector[1] = -1;
        else if(currentDir === RIGHT) vector[0] = 1;
        else if(currentDir === LEFT) vector[0] = -1;

        return vector;
    }

    SwitchDirection(mapIndex)
    {
        this.currentMap = mapIndex;
        
        this.spriteInfo.flipX = this.dirMaps[this.currentMap].flipX;
        this.spriteInfo.flipY = this.dirMaps[this.currentMap].flipY;
        this.spriteInfo.flipR = this.dirMaps[this.currentMap].flipR;
    }

    Charged()
    {
        var dirIndex = (this.currentMap + 1) % this.dirMaps.length;

        if(dirIndex !== this.currentMap)
        {
            this.SwitchDirection(dirIndex);
        }
    }
}