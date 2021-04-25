import { consoleLog, em, PIXEL_SCALE } from './main.js';

export default class Label
{
    constructor(pos, text, colour)
    {
        this.pos = pos;
        this.text = text;
        this.colour = colour;

        this.logging = false;

        //this.z = 200;

        this.font = null;

        em.AddRender(this);
    }

    Draw()
    {
        if(this.font)
        {
            consoleLog(this.font);
        }

        $screen.setCharset(this.font);

        if(this.logging)
        {
            consoleLog("RENDER LABEL");
            consoleLog(this);
        }

        locate(0, 0);
        pen(this.colour);
        print(this.text, this.pos.tileX * PIXEL_SCALE, this.pos.tileY * PIXEL_SCALE);
    }
}