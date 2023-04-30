import { EM, PIXEL_SCALE, consoleLog } from "../main";

export default class Sprite
{
    constructor(x, y, index, renderLayer, targetTexture)
    {
        if(renderLayer)
        {
            this.renderLayer = renderLayer;
        }

        this.targetTexture = $screen;

        if(targetTexture)
        {
            this.targetTexture = targetTexture;
        }

        this.x = x;
        this.y = y; 
        this.index = index;

        EM.RegisterEntity(this);
    }

    Draw()
    {
        this.targetTexture.sprite(this.index, this.x, this.y);
    }
}