import { consoleLog, EM } from "../main";

export default class Rect
{
    constructor(x, y, w, h, index, renderLayer, borderOnly, targetTexture)
    {
        if(renderLayer)
        {
            this.renderLayer = renderLayer;
        }

        this.texture = targetTexture ? targetTexture : $screen;

        consoleLog("Draw to texture:");
        consoleLog(this.texture);

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
        
        this.texture.paper(this.index);
        this.texture.pen ( this.index);
        if(this.borderOnly) 
        {  
            this.texture.rect(this.x, this.y, this.w, this.h);
        }
        else 
        {
            this.texture.rectf(this.x, this.y, this.w, this.h);
        }
    }
}