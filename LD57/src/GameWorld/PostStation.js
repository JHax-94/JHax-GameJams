
import { PIXEL_SCALE } from "../main"
import Freighter from "../Spacecraft/Freighter";
import AbstractCelestialBody from "./AbstractCelestialBody";

export default class PostStation extends AbstractCelestialBody
{
    constructor(pos, title, gameWorld, symbol)
    {   
        super(pos, { w: 1, h: 1 }, title, "STATION", gameWorld, symbol);

        this.upkeep = 100;

        this.sortRate = 0.1;

        this.freighters = [];

        this.upgrades = [
            { text: ["New Freighter"], cost: 500, upkeep: 20, type: "NewFreighter" },
            { text: ["Unlock Freighter", "Speed Upgrade"], cost: 200, upkeep: 10, type: "Unlock_SpeedUpgrade" },
            { text: ["Send Probe"], cost: 200, upkeep: 0, type: "SendProbe" },
            { text: ["Unlock Freighter", "Cargo Upgrade"], cost: 200, upkeep: 10, type: "Unlock_CargoUpgrade" },
            { text: ["Improve Sort", "Speed"], cost: 500, upkeep: 5 }
        ]
    }

    Update(deltaTime)
    {
        for(let i = 0; i < this.parcelStore.Count(); i ++)
        {
            let parcel = this.parcelStore.Parcel(i);

            if(!parcel.sorted)
            {
                parcel.SortProgress(this.sortRate * deltaTime);
            }
        }
    }

    AvailableUpgrades()
    {
        return this.upgrades;
    }

    SpawnFreighter()
    {   
        let newFreighter = new Freighter(this, "Freighter 0", this.gameWorld);

        this.gameWorld.RegisterSpacecraft(newFreighter);
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