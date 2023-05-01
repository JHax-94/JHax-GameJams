import { PIXEL_SCALE, playFx } from "../main";
import Whistle from "./Whistle";

export default class Horn extends Whistle
{
    constructor(src)
    {
        super(src, { type: "HORN", radius: 3.5 * PIXEL_SCALE });
    }

    AuraSound()
    {
        playFx("horn");
    }

    Draw()
    {
        if(this.IsActive())
        {
            this.DrawAura({ angle: -this.activeTimer });
        }
    }

}