import { consoleLog } from "./main";

export default class ProgressBar
{
    constructor(rect, colours)
    {
        if(rect.base)
        {
            this.base = rect.base;
        }
        else 
        {
            this.base = { x: 0, y: 0 };
        }

        this.rect = rect;
        this.colours = colours;
        this.SetValue(0.5);

        this.flip = false;

        if(rect.flip)
        {
            this.flip = rect.flip;
        }

        consoleLog("PROGRESS BAR CONSTRUCTED");
        consoleLog(this);
    }

    SetValue(val)
    {
        if(this.value !== val)
        {
            this.value = val;
            
            var fillDim = this.flip ? this.rect.h : this.rect.w;

            this.filledWidth = clamp(fillDim * this.value, 0, fillDim);
        }
    }
    
    CalculateValue(current, max)
    {
        if(max !== 0)
        {
            this.SetValue(current / max);
        }
        else
        {
            consoleLog("Progress Bar Went wrong: " + current + " / " + max);
        }
    }

    DrawX()
    {
        return this.base.x + this.rect.x;
    }

    DrawY()
    {
        return this.base.y + this.rect.y;
    }

    Draw()
    {
        paper(this.colours.background);
        //pen(this.colours.background);
        
        rectf(this.DrawX(), this.DrawY(), this.rect.w, this.rect.h);
        
        if(this.value > 0)
        {
            paper(this.colours.foreground);
            //pen(this.colours.foreground);
            if(this.flip) rectf(this.DrawX(), Math.floor(this.DrawY() + this.rect.h - this.filledWidth), this.rect.w, Math.ceil(this.filledWidth));
            else rectf(this.DrawX(), this.DrawY(), this.filledWidth, this.rect.h);
        }        
    }
}