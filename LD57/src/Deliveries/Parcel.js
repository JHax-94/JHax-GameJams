import Texture from "pixelbox/Texture";
import { consoleLog, EM, PIXEL_SCALE } from "../main";
import { vec2 } from "p2";

export default class Parcel
{
    constructor(sourcePlanet, targetPlanet, sorted)
    {
        this.sourcePlanet = sourcePlanet;
        this.targetPlanet = targetPlanet;

        this.startSqDistance = vec2.sqrDist(this.sourcePlanet.phys.position, this.targetPlanet.phys.position);

        this.reward = 100;

        this.gracePeriod = 60;

        if(sorted === false)
        {
            this.gracePeriod *= 3;
        }

        this.decayRate = 0.5;

        

        this.lifeTime = 0;

        this.sorted = sorted;

        this.sortProgress= 0;

        EM.RegisterEntity(this);
    }

    RewardValue()
    {
        let penaltyTime = 0;

        if(this.lifeTime > this.gracePeriod)
        {
            penaltyTime = this.lifeTime - this.gracePeriod;
        }

        return Math.ceil(this.reward - this.decayRate * penaltyTime);
    }

    RemainingGrace()
    {
        return this.gracePeriod - this.lifeTime;
    }

    GraceProportion()
    {
        return this.RemainingGrace() / this.gracePeriod;
    }

    Deliver(deliveredBy)
    {
        let destination = this.Destination();

        if(destination)
        {
            destination.DeliveryComplete();
        }

        deliveredBy.parcelStore.RemoveParcel(this);
        EM.RemoveEntity(this);
    }

    SortProgress(progressBy)
    {
        EM.hudLog.push(`${this.sortProgress.toFixed(3)} (+${progressBy.toFixed(3)})`);

        this.sortProgress += progressBy;

        if(this.sortProgress >= 1)
        {
            this.sortProgress = 1;
            this.sorted = true;
        }
    }

    Destination()
    {
        let destination = null;

        if(this.sorted)
        {
            destination = this.targetPlanet;
        }

        return destination;
    }

    TargetSymbol()
    {
        let symbolTex = null;

        if(this.Destination())
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