import { EM } from "../main";

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

    Update(deltaTime)
    {
        this.lifeTime += deltaTime;
    }
}