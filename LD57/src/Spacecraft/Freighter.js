import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE } from "../main";
import { vec2 } from "p2";
import ParcelStore from "../GameWorld/ParcelStore";
import Spacecraft from "./Spacecraft";

export default class Freighter extends Spacecraft
{
    constructor(atStation, title, gameWorld)
    {
        super(atStation, title, gameWorld, 0);
        this.parcelStore = new ParcelStore(this, 3);
        this.fuel = 20;
    }
    
    InternalUpdate(deltaTime)
    {
        if(this.dockedStation && this.parcelStore.Count() > 0)
        {
            this.dockTimer += deltaTime;
            if(this.dockTimer >=  this.dockProcessTime)
            {
                this.dockTimer -= this.dockProcessTime;

                this.parcelStore.CheckDeliveriesForDestination(this.dockedStation);
            }
        }
    }

    Draw()
    {
        super.Draw();


    }

    DrawFuelReadout()
    {
        paper(6);
        
    }
}
