import Texture from "pixelbox/Texture";
import { EM, PIXEL_SCALE, consoleLog, getObjectConfig, getObjectConfigByProperty } from "../main";

export default class VillageRequest
{
    constructor(village, beastsList)
    {
        this.renderLayer = "WORLD_UI";

        this.village = village;
        this.beastsList = beastsList;

        this.firstComplete = false;

        for(let i = 0; i < this.beastsList.length; i ++)
        {
            this.beastsList[i].completed = 0;
        }

        this.timeElapsed = 0;

        this.rewardsConfig = getObjectConfig("Rewards");

        this.rewardTex = new Texture(3 * PIXEL_SCALE, PIXEL_SCALE);
        this.progressTex = new Texture(3 * PIXEL_SCALE, PIXEL_SCALE);

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

            let addItem = null;

            if(beast.beastType === beastItem.beastType)
            {
                addGold += beastItem.rewards.perBeast;

                beastItem.completed ++;

                if(beastItem.completed >= beastItem.quantity)
                {
                    if(!this.firstComplete)
                    {
                        addGold += this.CalculateRewardForBeastItem(beastItem);
                        this.firstComplete = true;
                        beastItem.completed = 0;           
                        
                        this.village.RequestCompleted();
                    }
                    else
                    {
                        addItem = this.SubRewardForBeastItem(beastItem);
                        beastItem.completed = 0;
                    }

                    
                }
            }

            if(addGold > 0 || addItem)
            {
                let player = EM.GetEntity("PLAYER");
                if(addGold > 0)
                {
                    player.AddItem({
                        object: "Gold",
                        quantity: addGold
                    },
                    true);
                }
                if(addItem)
                {
                    player.AddItem({
                        object: addItem,
                        quantity: 1,
                    }, 
                    true);
                }
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

    SubRewardForBeastItem(beastItem)
    {
        return beastItem.rewards.subsequent;
    }

    HasSubRewards()
    {
        let subRewards = false;

        for(let i = 0; i < this.beastsList.length; i ++)
        {
            if(this.SubRewardForBeastItem(this.beastsList[i]))
            {
                subRewards = true;
                break;
            }
        }

        return subRewards;
    }

    Draw()
    {   
        if(this.firstComplete === false || this.HasSubRewards())
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

                sprite(beast.boardSprite, bannerRect.x - 0.5 * PIXEL_SCALE, bannerRect.y);

                this.progressTex.clear();
                this.progressTex.pen(1);
                this.progressTex.print(`${beastItem.completed}/${beastItem.quantity}`, 0, 0);
                this.progressTex._drawEnhanced(bannerRect.x + PIXEL_SCALE, bannerRect.y + 2, { scale: 2 });

                if(!this.firstComplete)
                {
                    let rewardValue =  this.CalculateRewardForBeastItem(beastItem);

                    sprite(gold.spriteIndex, bannerRect.x + 3 * PIXEL_SCALE, bannerRect.y);
                    this.rewardTex.clear();
                    this.rewardTex.print(`${rewardValue}`, 0, 0);
                    this.rewardTex._drawEnhanced(bannerRect.x + 4 *PIXEL_SCALE, bannerRect.y + 2, { scale: 2});
                }
                else
                {
                    let nextReward = this.SubRewardForBeastItem(beastItem);

                    let rewardConf = getObjectConfig(nextReward);

                    sprite(rewardConf.spriteIndex, bannerRect.x + 4 * PIXEL_SCALE, bannerRect.y);
                }
            }
        }
    }
    
}