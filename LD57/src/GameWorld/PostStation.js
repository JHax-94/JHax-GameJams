
import Texture from "pixelbox/Texture";
import { PIXEL_SCALE } from "../main"
import Freighter from "../Spacecraft/Freighter";
import Tanker from "../Spacecraft/Tanker";
import AbstractCelestialBody from "./AbstractCelestialBody";

export default class PostStation extends AbstractCelestialBody
{
    constructor(pos, title, gameWorld, symbol, isFirstStation = false)
    {   
        super(pos, { w: 1, h: 1 }, title, "STATION", gameWorld, symbol);

        this.upkeep = 100;

        this.sortRate = 0.1;

        this.refuelRate = 12;

        this.tex = this.PostStationTexture();

        this.freighters = [];
        
        this.parcelsSorted = 0;

        if(isFirstStation)
        {
            this.ForceUpgrade("NewTanker");
        }

        this.blinkerColours = [ 7, 9, 10, 15 ];

        this.blinkers = [
            { x: 2, y: 5, on: 1.2, off: 0.3, timer: Math.random() },
            { x: 5, y: 6, on: 0.4, off: 0.4, timer: Math.random() },
            { x: 8, y: 23, on: 0.6, off: 0.5, timer: Math.random() }
        ];

        for(let i = 0; i < this.blinkers.length; i++)
        {
            let colour = random(this.blinkerColours.length);
            this.blinkers[i].colour = this.blinkerColours[colour];
            this.blinkerColours.splice(colour, 1);
        }

        this.nextUpgradeUnlock = isFirstStation ? this.GetUnlockCondition("GlobalDeliveries") : this.GetNextUpgradeUnlock();
        this.upgradeLevel ++;
    }

    PostStationTexture()
    {
        let tex = new Texture(PIXEL_SCALE, 2 * PIXEL_SCALE);

        tex.sprite(16,0, 0);
        tex.sprite(50,0,PIXEL_SCALE);

        return tex;
    }

    ParcelsSorted()
    {
        return this.parcelsSorted;
    }

    SendProbe()
    {
        this.gameWorld.GenerateNewPlanet();
    }

    IsStation()
    {
        return true;
    }

    Update(deltaTime)
    {
        this.CheckUnlockCondition();

        for(let i = 0; i < this.parcelStore.Count(); i ++)
        {
            let parcel = this.parcelStore.Parcel(i);

            if(!parcel.sorted)
            {
                parcel.SortProgress(this.sortRate * deltaTime);
                if(parcel.sorted)
                {
                    this.parcelsSorted ++;
                }
            }
        }

        for(let i = 0; i < this.blinkers.length; i ++)
        {
            let blink = this.blinkers[i];

            blink.timer += deltaTime;

            if(blink.timer >= blink.on + blink.off)
            {
                blink.timer = 0;
            }
        }
    }

    SpawnTanker()
    {
        let name = this.gameWorld.GetNextTankerName()
        
        let newTanker = new Tanker(this, name, this.gameWorld);

        this.gameWorld.RegisterSpacecraft(newTanker);
    }

    SpawnFreighter()
    {   
        let name = this.gameWorld.GetNextFreighterName();

        let newFreighter = new Freighter(this, name, this.gameWorld);

        this.gameWorld.RegisterSpacecraft(newFreighter);
        this.freighters.push(newFreighter);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        paper(1);
        
        //rectf(screenPos.x, screenPos.y, this.w * PIXEL_SCALE, this.h * PIXEL_SCALE);
        this.tex._drawEnhanced(screenPos.x, screenPos.y);
        let drawn = this.DrawParcelsForPickup(screenPos, true, 9);
        this.DrawParcelsInSorting(screenPos, drawn, 9);
        this.DrawSymbol(screenPos);
        this.DrawFocus(screenPos);

        for(let i = 0; i < this.blinkers.length; i ++)
        {
            let blink = this.blinkers[i];

            if(blink.timer <= blink.on)
            {
                paper(blink.colour);
            }
            else
            {
                paper(4);
            }
            rectf(screenPos.x + blink.x, screenPos.y + blink.y, 2, 2);
        }
        //this.DrawOffscreen(screenPos);
    }
}