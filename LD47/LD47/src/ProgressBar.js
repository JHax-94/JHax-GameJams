import { consoleLog } from "./main";

export default class ProgressBar
{
    constructor(rect, colours)
    {
        this.rect = rect;
        this.colours = colours;
        this.SetValue(0.5);

        consoleLog("PROGRESS BAR CONSTRUCTED");
        consoleLog(this);
    }

    SetValue(val)
    {
        if(this.value !== val)
        {
            this.value = val;
            this.filledWidth = clamp(this.rect.w * this.value, 0, this.rect.w);
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
        rectf(this.rect.x, this.rect.y, this.filledWidth, this.rect.h);

    }
}