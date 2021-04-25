import { consoleLog, em, OXYGEN_TANK_SPRITES, OXYGEN_CONF, PIXEL_SCALE } from "./main";

export default class OxygenMeter 
{
    constructor(tileRect, tankSize)
    {
        this.tileRect = tileRect;
        this.screenRect = { x: this.tileRect.x * PIXEL_SCALE, y: this.tileRect.y * PIXEL_SCALE, w: this.tileRect.w * PIXEL_SCALE, h: this.tileRect.h * PIXEL_SCALE };
        this.filledRect = this.screenRect;

        this.tankSize = tankSize;

        this.oxygenMax = this.tankSize * OXYGEN_CONF.oxygenPerTank;
        this.oxygen = this.oxygenMax;

        this.depletionRate = OXYGEN_CONF.depletionRate;

        this.SetupTank();

        this.filledColour = 7;
        this.emptyColour = 4;

        this.SetFilled(this.oxygen, this.oxygenMax);

        consoleLog("OXYGEN METER CONSTRUCTED");
        consoleLog(this);

        em.AddRender(this);
    }

    SetupTank()
    {
        this.spriteList = [];

        this.spriteList.push({ index: OXYGEN_TANK_SPRITES.top, offset: { x: 0, y: 0 } });

        for(var i = 0; i < this.tankSize; i ++)
        {
            this.spriteList.push( { index: OXYGEN_TANK_SPRITES.mid, offset: { x: 0, y: 1 + i } });
        }

        this.fillRects = []; 
        this.oxygenTopOffset = 13;
        this.oxygenBottomOffset = 2;
        this.oxygenEndPixels = 2;
        this.oxygenInset = 6;

        this.meterBounds = {
            x: (this.tileRect.x * PIXEL_SCALE + this.oxygenInset),
            y: (this.tileRect.y * PIXEL_SCALE + this.oxygenTopOffset), 
            h: (this.tankSize * PIXEL_SCALE) + this.oxygenEndPixels * 3,
            w: 4
        };

        for(var i = 0; i < this.meterBounds.w; i ++)
        {
            var shortSection = (i === 0) || i === (this.meterBounds.w - 1);

            this.fillRects.push(
                {
                    shorten: shortSection,
                    minY: shortSection ? this.meterBounds.y + 1 : this.meterBounds.y,
                    offsetX: i,
                    colour: (i === this.meterBounds.w - 1) ? 7 : 6,
                    maxH: (i === 0) || i === (this.meterBounds.w - 1) ? this.meterBounds.h - 2 : this.meterBounds.h
                }
            )
        }

        this.spriteList.push({ index: OXYGEN_TANK_SPRITES.bottom, offset: { x: 0, y: this.tankSize + 1 }});
    }

    UpgradeOxygen()
    {
        this.tankSize ++;
        this.oxygenMax = this.tankSize * OXYGEN_CONF.oxygenPerTank;
        this.SetupTank();
        this.AddOxygen(OXYGEN_CONF.oxygenPerTank);
    }

    AddOxygen(amount)
    {
        this.oxygen += amount;

        if(this.oxygen >= this.oxygenMax)
        {
            this.oxygen = this.oxygenMax;            
        }
        
        if(this.oxygen <= 0)
        {
            this.oxygen = 0;
            em.EndLevel();
        }

        this.SetFilled(this.oxygen, this.oxygenMax);
    }


    SetFilled(current, max)
    {
        var fill = current / max;
        /*consoleLog("Calculate fill");
        consoleLog(current + " / " + max + " = " + fill);*/
        this.UpdateRects(fill);
    }

    UpdateRects(filledAmount)
    {
        /*
        this.filledRect = {
            x: this.screenRect.x,
            w: this.screenRect.w,
        };

        this.filledRect.h = this.screenRect.h * filledAmount;
        this.filledRect.y = this.screenRect.y + (this.screenRect.h - this.filledRect.h);*/

        var filledHeight = this.meterBounds.h * filledAmount;

        this.filledRect = {
            x: this.meterBounds.x,
            y: this.meterBounds.y + (this.meterBounds.h - filledHeight),
            h: filledHeight,
            w: this.meterBounds.w
        };

        for(var i = 0; i < this.fillRects.length; i ++)
        {
            var newHeight = this.filledRect.h - (this.fillRects[i].shorten ? 1 : 0);

            if(newHeight > this.fillRects[i].maxH) newHeight = this.fillRects[i].maxH;

            this.fillRects[i].y = this.filledRect.y < this.fillRects[i].minY ? this.fillRects[i].minY : this.filledRect.y;
            this.fillRects[i].h = newHeight;
        }
    }


    Draw()
    {
        /*
        paper(this.emptyColour);
        rectf(this.screenRect.x, this.screenRect.y, this.screenRect.w, this.screenRect.h);
        */

        for(var i = 0; i < this.spriteList.length; i ++)
        {
            sprite(this.spriteList[i].index, (this.tileRect.x + this.spriteList[i].offset.x) * PIXEL_SCALE, (this.tileRect.y + this.spriteList[i].offset.y) * PIXEL_SCALE);
        }
    

        for(var i = 0; i < this.fillRects.length; i ++)
        {
            paper(this.fillRects[i].colour);
            rectf(this.filledRect.x + this.fillRects[i].offsetX, this.fillRects[i].y, 1, this.fillRects[i].h);
        }
        
    }

}