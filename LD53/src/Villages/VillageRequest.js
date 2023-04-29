import { EM, PIXEL_SCALE, consoleLog, getObjectConfig, getObjectConfigByProperty } from "../main";

export default class VillageRequest
{
    constructor(village, beastsList)
    {
        this.renderLayer = "WORLD_UI";

        this.village = village;
        this.beastsList = beastsList;

        for(let i = 0; i < this.beastsList.length; i ++)
        {
            this.beastsList[i].completed = 0;
        }

        EM.RegisterEntity(this);
    }

    BeastRequired(beast)
    {
        let required = false;

        for(let i = 0; i < this.beastsList.length; i ++)
        {
            let beastItem = this.beastsList[i];

            if(beast.beastType === beastItem.beastType && beastItem.completed < beastItem.quantity)
            {
                required = true;
                break;
            }
        }

        return required;
    }

    SupplyBeast(beast)
    {
        for(let i = 0; i < this.beastsList.length; i ++)
        {
            let beastItem = this.beastsList[i];

            if(beast.beastType === beastItem.beastType)
            {
                beastItem.completed ++;
            }
        }
    }

    Draw()
    {   
        
        let baseP = this.village.GetScreenPos();

        let bannerRect = {
            x: baseP.x,
            y: baseP.y - 1.5*PIXEL_SCALE,
            w: 3 * PIXEL_SCALE,
            h: PIXEL_SCALE
        }
        paper(0);
        rectf(bannerRect.x - 0.5*PIXEL_SCALE, bannerRect.y, bannerRect.w, bannerRect.h);

        for(let i = 0; i < this.beastsList.length; i ++)
        {
            let beastItem = this.beastsList[i];

            let beast = getObjectConfigByProperty("beastType", beastItem.beastType);

            sprite(beast.boardSprite, bannerRect.x, bannerRect.y);

            pen(1);
            print(`${beastItem.completed} / ${beastItem.quantity}`, bannerRect.x + PIXEL_SCALE, bannerRect.y + 0.3*PIXEL_SCALE);
        }
    }
    
}