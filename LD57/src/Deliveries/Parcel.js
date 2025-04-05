import Texture from "pixelbox/Texture";
import { EM, PIXEL_SCALE } from "../main";

export default class Parcel
{
    constructor(targetPlanet)
    {
        this.targetPlanet = targetPlanet;

        this.reward = 100;

        this.gracePeriod = 30;

        this.decayRate = 0.5;

        this.lifeTime = 0;

        EM.RegisterEntity(this);
    }

    RewardValue()
    {
        let penaltyTime = 0;

        if(this.lifeTime > this.gracePeriod)
        {
            penaltyTime = this.lifeTime - this.gracePeriod;
        }

        return this.reward - this.decayRate * penaltyTime;
    }

    Deliver(deliveredBy)
    {
        deliveredBy.parcelStore.RemoveParcel(this);
        EM.RemoveEntity(this);
    }

    Destination()
    {
        return this.targetPlanet;
    }

    TargetSymbol()
    {
        let symbolTex = null;

        if(this.targetPlanet)
        {
            symbolTex = this.targetPlanet.symbolTex;
        }
        else
        {
            symbolTex = new Texture(PIXEL_SCALE, PIXEL_SCALE);
            symbolTex.sprite(33,0,0);            
        }

        return symbolTex;
    }   

    Update(deltaTime)
    {
        this.lifeTime += deltaTime;
    }
}