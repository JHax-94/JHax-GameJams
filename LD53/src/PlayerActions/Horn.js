import { PIXEL_SCALE } from "../main";
import Whistle from "./Whistle";

export default class Horn extends Whistle
{
    constructor(src)
    {
        super(src, { type: "HORN", radius: 3.5 * PIXEL_SCALE });
    }

    Draw()
    {
        if(this.IsActive())
        {
            this.DrawAura({ angle: -this.activeTimer });
        }
    }

}