import InfluenceZone from "../GameWorld/InfluenceZone";
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE } from "../main";
import Spacecraft from "./Spacecraft";

export default class Tanker extends Spacecraft
{
    constructor(atStation, title, gameworld)
    {
        super(atStation, title, gameworld, 48);

        this.upkeep = 40;
        this.maxFuel = 10000;
        this.fuel = 10000;
        this.fuelRate = 20;

        this.maxSpeed = 10;
        this.thrustForce = 45000;

        this.refuelRate = 20;

        this.spacecraftInRange = [];

        this.influenceZone = new InfluenceZone(this, { w: 2, h: 2}, "SPACECRAFT", COLLISION_GROUP.SPACECRAFT_ZONE, COLLISION_GROUP.SPACECRAFT);
    }

    AddSpacecraft(spacecraft)
    {
        if(spacecraft !== this)
        {
            if(this.spacecraftInRange.indexOf(spacecraft) < 0)
            {
                this.spacecraftInRange.push(spacecraft);
            }

            if(spacecraft === this.target)
            {
                this.UnsetTarget();
            }
        }
    }

    RemoveSpacecraft(spacecraft)
    {
        let index = this.spacecraftInRange.indexOf(spacecraft);

        if(index >= 0)
        {
            this.spacecraftInRange.splice(index, 1);
        }
    }

    ApplyDamping()
    {
        return this.currentSpeed > 0 && this.fuel > 0 && (this.dockedStation !== null || this.spacecraftInRange.length > 0);
    }

    ShipsInNeedOfFuelInRange()
    {
        let count = 0;

        for(let i = 0; i < this.spacecraftInRange.length; i ++)
        {
            if(this.CanFuel(this.spacecraftInRange[i]))
            {
                count ++;
            }
        }
        return count;
    }

    CanFuel(craft)
    {
        return craft.fuel < craft.maxFuel && craft.currentSpeed < 1;
    }

    InternalUpdate(deltaTime)
    {
        this.influenceZone.phys.position = this.phys.position;

        if(this.currentSpeed < 0.1)
        {
            for(let i = 0; i < this.spacecraftInRange.length; i ++)
            {
                let craft = this.spacecraftInRange[i];

                if(this.CanFuel(craft))
                {
                    let fuelTransfer = deltaTime * this.fuelRate;
                    let refuelComplete = false;

                    if(craft.maxFuel - craft.fuel < fuelTransfer)
                    {
                        fuelTransfer = craft.maxFuel - craft.fuel;
                        refuelComplete = true;
                    }

                    if(fuelTransfer > this.fuel)
                    {
                        fuelTransfer = this.fuel;
                    }

                    this.fuel -= fuelTransfer;
                    craft.fuel += fuelTransfer;

                    if(refuelComplete)
                    {
                        craft.RefuelComplete();
                    }
                }
                else if(craft.fuel === 0 && craft.currentSpeed > 1)
                {
                    craft.phys.velocity = [0, 0];
                    craft.UnsetTarget();
                }
            }
        }
    }
}