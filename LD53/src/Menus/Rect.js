import { consoleLog, EM } from "../main";

export default class Rect
{
    constructor(x, y, w, h, index, renderLayer)
    {
        if(renderLayer)
        {
            this.renderLayer = renderLayer;
        }

        this.x = x;
        this.y = y; 
        this.w = w;
        this.h = h;
        this.index = index;

        EM.RegisterEntity(this);
    }

    Draw()
    {
        paper(this.index);
        rectf(this.x, this.y, this.w, this.h);
    }
}