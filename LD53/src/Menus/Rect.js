import { consoleLog, EM } from "../main";

export default class Rect
{
    constructor(x, y, w, h, index, renderLayer, borderOnly)
    {
        if(renderLayer)
        {
            this.renderLayer = renderLayer;
        }

        if(borderOnly)
        {
            this.borderOnly = borderOnly;
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
        pen ( this.index);
        if(this.borderOnly) 
        {  
            rect(this.x, this.y, this.w, this.h);
        }
        else 
        {
            rectf(this.x, this.y, this.w, this.h);
        }
    }
}