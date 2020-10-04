import { consoleLog } from "./main";

export default class ProgressBar
{
    constructor(rect, colours)
    {
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
            consoleLog("Ooopsie");
        }
    }

    Draw()
    {
        paper(this.colours.background);
        //pen(this.colours.background);
        
        rectf(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        
        
        paper(this.colours.foreground);
        //pen(this.colours.foreground);
        if(this.flip) rectf(this.rect.x, this.rect.y + this.rect.h - this.filledWidth, this.rect.w, Math.ceil(this.filledWidth));
        else rectf(this.rect.x, this.rect.y, this.filledWidth, this.rect.h);
        

    }
}