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

        this.timeElapsed = 0;

        this.rewardsConfig = getObjectConfig("Rewards");

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

            let addGold = 0;

            if(beast.beastType === beastItem.beastType)
            {
                addGold += beastItem.rewards.perBeast;

                beastItem.completed ++;

                if(beastItem.completed >= beastItem.quantity)
                {
                    addGold += this.CalculateRewardForBeastItem(beastItem);
                }
            }

            if(addGold > 0)
            {
                let player = EM.GetEntity("PLAYER");

                player.AddItem({
                    object: "Gold",
                    quantity: addGold
                },
                true);
            }
        }
    }

    Update(deltaTime)
    {
        this.timeElapsed += deltaTime;
    }

    CalculateRewardForBeastItem(beastItem)
    {
        let dropOff = Math.floor(this.timeElapsed / this.rewardsConfig.dropOffTime);

        let value = beastItem.rewards.complete - dropOff;

        if(value < beastItem.rewards.perBeast)
        {
            value = beastItem.rewards.perBeast;
        }

        return value;
    }

    Draw()
    {   
        let baseP = this.village.GetScreenPos();

        let bannerRect = {
            x: baseP.x,
            y: baseP.y - 1.5*PIXEL_SCALE,
            w: 6 * PIXEL_SCALE,
            h: PIXEL_SCALE
        }
        paper(0);
        rectf(bannerRect.x - 0.5*PIXEL_SCALE, bannerRect.y, bannerRect.w, bannerRect.h);

        for(let i = 0; i < this.beastsList.length; i ++)
        {
            let beastItem = this.beastsList[i];

            let beast = getObjectConfigByProperty("beastType", beastItem.beastType);

            let gold = getObjectConfig("Gold", true);

            sprite(beast.boardSprite, bannerRect.x, bannerRect.y);

            pen(1);
            print(`${beastItem.completed} / ${beastItem.quantity}`, bannerRect.x + PIXEL_SCALE, bannerRect.y + 0.3*PIXEL_SCALE);

            let rewardValue =  this.CalculateRewardForBeastItem(beastItem);

            sprite(gold.spriteIndex, bannerRect.x + 3 * PIXEL_SCALE, bannerRect.y);
            print(`${rewardValue}`, bannerRect.x + 4 *PIXEL_SCALE, bannerRect.y + 0.3 * PIXEL_SCALE);
        }
    }
    
}