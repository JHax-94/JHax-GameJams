import { em, PIXEL_SCALE } from "./main";

export class Label
{
    constructor(pos, text, colour)
    {
        this.pos = pos;
        this.text = text;
        this.colour = colour;

        this.z = 200;

        em.AddRender(this);
    }

    Draw()
    {
        locate(0, 0);
        pen(this.colour);
        print(this.text, this.pos.tileX * PIXEL_SCALE, this.pos.tileY * PIXEL_SCALE);
    }
}