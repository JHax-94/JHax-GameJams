import { consoleLog, EM, getFont, PIXEL_SCALE, setFont, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main";
import AbstractUi from "../UI/AbstractUi";

export default class TutorialItem extends AbstractUi
{
    constructor(control, dims)
    {
        super();

        this.dims = {
            x: null,
            y: null,
            w: 20,
            h: 20
        };

        consoleLog("DEFAULT DIMS");
        consoleLog(this.dims);

        this.font = getFont("LargeNarr");

        if(dims)
        {
            if(dims.x != null) this.dims.x = dims.x;
            if(dims.y != null) this.dims.y = dims.y;
            if(dims.w != null) this.dims.w = dims.w;
            if(dims.h != null) this.dims.h = dims.h;
        }

        

        if(this.dims.x == null) this.dims.x = 0.5 *(TILE_WIDTH - this.dims.w);
        if(this.dims.y == null) this.dims.y = 0.5 *(TILE_HEIGHT - this.dims.h);

        consoleLog("CONSTRUCTED DIMS:");
        consoleLog(this.dims);

        this.control = control;
    }

    DrawWindow(atObject = null)
    {
        if(atObject)
        {
            let obj = atObject.obj;
            let screenPos = obj.GetScreenPos();
            
            let off = {
                x: 0,
                y: 0
            };

            if(atObject.off)
            {
                off.x = atObject.off?.x ?? 0;
                off.y = atObject.off?.y ?? 0;
            }

            this.dims.x = (screenPos.x / PIXEL_SCALE) - (this.dims.w - 1) * 0.5 + off.x;
            this.dims.y = (screenPos.y / PIXEL_SCALE) - (this.dims.h - 1) * 0.5 + off.y;
        }

        paper(8);
        pen(12);

        EM.hudLog.push(`Tut: (${this.dims.x}, ${this.dims.y}) [${this.dims.w}, ${this.dims.h}]`);

        rectf(this.dims.x * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
        rect(this.dims.x * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
    }

    DrawTutorial() {}

    CheckTutorialEnd(update) { }
    
    Activate() { }
}