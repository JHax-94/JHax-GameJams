import Component from "./Component"
import { consoleLog, GetAltSwitchDirMapFromDir, UP, DOWN, LEFT, RIGHT, COLOURS, em } from "./main";

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

        this.SetBarDirections(altSwitch);
        this.SetupDecay(altSwitch);

        this.chargeProgress = this.AddProgressBar(this.chargeBarDir, { bg: COLOURS.barBg, fg: COLOURS.chargeBarFg });
        this.decayProgress = this.AddProgressBar(this.decayBarDir, { bg: COLOURS.barBg, fg: COLOURS.decayBarFg });

        consoleLog("Alt Switch constructed:");
        consoleLog(this);

        this.SwitchDirection(0);
        this.ResetProgressBars();

        this.logging = true;
        this.logName = "ALT SWITCH";

        em.AddUpdate(this);
    }

    GetFlippedDirection()
    {
        var vector = [0, 0];
        
        var dMap = this.dirMaps[this.currentMap];

        consoleLog("USE D MAP");
        consoleLog(dMap);

        if(dMap.setDir === UP) vector[1] = 1;
        else if(dMap.setDir === DOWN) vector[1] = -1;
        else if(dMap.setDir === RIGHT) vector[0] = 1;
        else if(dMap.setDir === LEFT) vector[0] = -1;

        return vector;
    }

    SwitchDirection(mapIndex)
    {
        this.currentMap = mapIndex;
        
        this.spriteInfo.flipX = this.dirMaps[this.currentMap].flipX;
        this.spriteInfo.flipY = this.dirMaps[this.currentMap].flipY;
        this.spriteInfo.flipR = this.dirMaps[this.currentMap].flipR;
    }

    Update(deltaTime)
    {
        super.ChargeDecay(deltaTime);
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