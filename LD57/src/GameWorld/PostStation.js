
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH } from "../main"
import MOUSE_BUTTON from "../MouseButtons";
import Freighter from "../Spacecraft/Freighter";
import AbstractCelestialBody from "./AbstractCelestialBody";

export default class PostStation extends AbstractCelestialBody
{
    constructor(pos, title, gameWorld, symbol)
    {   
        super(pos, { w: 1, h: 1 }, title, "STATION", gameWorld, symbol);

        this.freighters = [];
    }

    SpawnFreighter()
    {   
        let newFreighter = new Freighter(this, "Freighter 0", this.gameWorld);

        this.freighters.push(newFreighter);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        paper(1);
        
        rectf(screenPos.x, screenPos.y, this.w * PIXEL_SCALE, this.h * PIXEL_SCALE);

        this.DrawParcelsForPickup(screenPos);
        this.DrawSymbol(screenPos);
        this.DrawFocus(screenPos);
    }
}