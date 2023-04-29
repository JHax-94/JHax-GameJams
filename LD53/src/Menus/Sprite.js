import { EM, PIXEL_SCALE, consoleLog } from "../main";

export default class Sprite
{
    constructor(x, y, index, renderLayer)
    {
        if(renderLayer)
        {
            this.renderLayer = renderLayer;
        }

        this.x = x;
        this.y = y; 
        this.index = index;

        EM.RegisterEntity(this);
    }

    Draw()
    {
        sprite(this.index, this.x, this.y);
    }
}