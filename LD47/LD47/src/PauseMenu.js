import Label from './Label.js';
import { consoleLog, em, PIXEL_SCALE } from "./main.js";

export default class PauseMenu
{
    constructor(displayRect, textLines, colours)
    {
        this.displayRect = displayRect;
        this.textLines = textLines;
        this.colours = colours;
        this.labels = [];

        for(var i = 0; i < this.textLines.length; i ++)
        {
            var newLabel = new Label(this.textLines[i].pos, this.textLines[i].text, 4);
            newLabel.z = 1010;
            this.labels.push(newLabel);
        }

        em.AddRender(this);
        this.Hide();
        this.z = 1000;
    }

    Show(display)
    {
        if(display == null)
        {
            display = true;
        }

        for(var i = 0; i < this.labels.length; i ++)
        {
            this.labels[i].hide = !display;
        }
        this.hide = !display;
    }

    Hide()
    {
        this.Show(false);
    }

    Draw()
    {
        paper(this.colours.background);
        rectf((this.displayRect.tileX - 0.25)* PIXEL_SCALE, (this.displayRect.tileY + 0.5) * PIXEL_SCALE, this.displayRect.tileW * PIXEL_SCALE, this.displayRect.tileH * PIXEL_SCALE);
        paper(this.colours.foreground);
        rectf(this.displayRect.tileX * PIXEL_SCALE, this.displayRect.tileY * PIXEL_SCALE, this.displayRect.tileW * PIXEL_SCALE, this.displayRect.tileH * PIXEL_SCALE);
    }    
}