import { EM, PIXEL_SCALE } from "../main";

export default class GameWorld
{
    constructor()
    {
        EM.RegisterEntity(this);
    }

    Draw()
    {
        paper(7);
        rectf(0, 0, PIXEL_SCALE, PIXEL_SCALE);
    }
}