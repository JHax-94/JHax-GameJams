import Texture from "pixelbox/Texture";
import { AUDIO, consoleLog, EM, PIXEL_SCALE } from "../main";
import { vec2 } from "p2";

export default class Parcel
{
    constructor(sourcePlanet, targetPlanet, sorted)
    {
        this.sourcePlanet = sourcePlanet;
        this.targetPlanet = targetPlanet;

        this.startSqDistance = vec2.sqrDist(this.sourcePlanet.phys.position, this.targetPlanet.phys.position);

        this.reward = this.sourcePlanet.baseReward;

        this.gracePeriod = this.sourcePlanet.baseGracePeriod;

        this.currentStore = null;

        if(sorted === false)
        {
            this.gracePeriod *= 3;
        }

        this.gameWorld = this.sourcePlanet.gameWorld;

        this.decayRate = 0.5;

        this.lifeTime = 0;

        this.sorted = sorted;

        this.sortProgress= 0;

        EM.RegisterEntity(this);
    }

    SetStore(parcelStore)
    {
        this.currentStore = parcelStore;
    }

    RewardValue()
    {
        let penaltyTime = 0;

        if(this.lifeTime > this.gracePeriod)
        {
            penaltyTime = this.lifeTime - this.gracePeriod;
        }

        let value = Math.ceil(this.reward - this.decayRate * penaltyTime);

        if(value < 0)
        {
            value = 0;

            if(this.gameWorld.ExpiredParcelsDisappear())
            {
                this.Expire();
            }
        }

        return value;
    }

    RemainingGrace()
    {
        return this.gracePeriod - this.lifeTime;
    }

    GraceProportion()
    {
        return this.RemainingGrace() / this.gracePeriod;
    }

    Expire()
    {
        this.currentStore.RemoveParcel(this);
        EM.RemoveEntity(this);
    }

    Deliver(deliveredBy)
    {
        let destination = this.Destination();

        if(destination)
        {
            destination.DeliveryComplete();
            AUDIO.PlayFx("deliver");
        }

        deliveredBy.parcelStore.RemoveParcel(this);
        EM.RemoveEntity(this);
    }

    SortProgress(progressBy)
    {
        /*EM.hudLog.push(`${this.sortProgress.toFixed(3)} (+${progressBy.toFixed(3)})`);*/

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
        /*EM.hudLog.push(`Grace period: ${this.gracePeriod}`);*/

        this.lifeTime += deltaTime;
    }
}