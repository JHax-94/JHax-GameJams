import ChartSheet from "./ChartSheet";
import Collectable from "./Collectable";
import { consoleLog, em, GetPearl, SFX } from "./main";

export default class Pearl extends Collectable
{
    constructor(spawnPosition, pearlInfo, container)
    {
        var physParams = { isKinematic: true };
        super(spawnPosition, physParams, container);
        
        this.sfx = SFX.pearlGetA;

        this.spriteIndex = 68;

        this.pearlInfo = pearlInfo;
    }
 
    PlaySoundEffect()
    {
        super.PlaySoundEffect();
        sfx(SFX.pearlGetB);
    }

    DisplayPearl()
    {
        var pearl = GetPearl(this.pearlInfo.pearlId);
        var components = [];

        em.pause = true;

        for(var i = 0; i < pearl.pearlText.length; i ++)
        {
            components.push(
                {
                    type: "Label",
                    id: "PEARL_" + i,
                    text: pearl.pearlText[i],
                    pos: {x: 0.5, y: 0.5 + i },
                    font: assets.charsets.large_font
                });
        }

        var pearlSheet = new ChartSheet(
            {
                x: 8,
                y: 10,
                w: 14,
                h: 1+components.length
            },
            {
                foreground: 34,
                shadow: 0,
                text: 53,
                hover: 32
            },
            components,
            true,
            this);
    }

    SheetClosed()
    {
        em.pause = false;
    }

    InternalCollect(diver)
    {
        consoleLog("INTERNAL COLLECT BY: ");
        consoleLog(diver); 
        diver.pearls.push(this.pearlInfo);

        this.DisplayPearl();
    }
}