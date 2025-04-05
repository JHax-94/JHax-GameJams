import { COLLISION_GROUP, EM, PIXEL_SCALE } from "../main";
import AbstractCelestialBody from "./AbstractCelestialBody";

export default class Planet extends AbstractCelestialBody
{
    constructor(pos, title, gameWorld)
    {
        super(pos, {w:1, h:1}, title, "PLANET", gameWorld)
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        paper(14);
        rectf(screenPos.x, screenPos.y, this.w * PIXEL_SCALE,  this.h * PIXEL_SCALE);

        this.DrawSymbol(screenPos);
        this.DrawFocus(screenPos);
    }
}