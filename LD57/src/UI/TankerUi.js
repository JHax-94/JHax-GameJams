import { EM, getFont, PIXEL_SCALE, setFont, TILE_HEIGHT, UTIL } from "../main";
import Tanker from "../Spacecraft/Tanker";

export default class TankerUi
{
    constructor(gameworld)
    {
        this.renderLayer = "UI";

        let tileHeight = 4;

        this.fuelPanel = { x: 2, y: (TILE_HEIGHT- tileHeight) * PIXEL_SCALE - 2, w: 8 * PIXEL_SCALE, h: tileHeight * PIXEL_SCALE };

        this.largeNarr = getFont("LargeNarr");

        this.gameWorld = gameworld;

        EM.RegisterEntity(this);
    }

    SelectedTanker()
    {
        let tanker = null;

        if(this.gameWorld.selected && this.gameWorld.selected instanceof Tanker)
        {
            tanker = this.gameWorld.selected;
        }

        return tanker;
    }

    Draw()
    {
        let tanker = this.SelectedTanker();
        if(tanker !== null)
        {
            paper(6);
            rectf(this.fuelPanel.x, this.fuelPanel.y, this.fuelPanel.w, this.fuelPanel.h);

            setFont(this.largeNarr);
            pen(1);
            print('FUEL:', this.fuelPanel.x + 2, this.fuelPanel.y + 2);

            print(`${Math.floor(tanker.fuel)} / ${tanker.maxFuel}`, this.fuelPanel.x + 2, this.fuelPanel.y + 14);

            setFont("Default");
        }
    }
}