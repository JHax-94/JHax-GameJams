import { consoleLog, EM, PIXEL_SCALE } from "../main";
import UiComponent from "./UiComponent";

export default class Rect extends UiComponent
{
    constructor(x, y, w, h, index, renderLayer, parent)
    {
        super(parent);

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

    Pos()
    {
        return { x: this.x, y: this.y };
    }


    Draw()
    {
        let rp = this.RootPos();

        paper(this.index);
        rectf(rp.x * PIXEL_SCALE, rp.y * PIXEL_SCALE, this.w * PIXEL_SCALE, this.h * PIXEL_SCALE);
    }
}