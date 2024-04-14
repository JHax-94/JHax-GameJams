import { EM, PIXEL_SCALE, TILE_HEIGHT } from "../main";

export default class ImpInstructions
{
    constructor(imp)
    {
        this.imp = imp;
    }

    DrawInstructions(frame)
    {

        EM.hudLog.push(`Imp instructions!`);
        paper(0);

        let startY = (TILE_HEIGHT / 2) * PIXEL_SCALE;

        rectf(frame.x + frame.padding, frame.y + startY, PIXEL_SCALE, PIXEL_SCALE);
    }
}