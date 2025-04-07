import { extend } from "p2/src/utils/Utils"
import Spacecraft from "./Spacecraft"
import { consoleLog, EM } from "../main";

export default class Probe extends Spacecraft
{
    constructor(startAt, gameWorld, target)
    {
        super(startAt, "PROBE", gameWorld, 51);

        this.thrustForce = 90000;
        this.maxSpeed = 40;

        this.target = target;
    }

    ArrivedAtCelestial(celestial)
    {
        consoleLog("PROBE ARRIVED AT:");
        consoleLog(celestial);

        consoleLog(`Probe target? ${celestial === this.target}`);

        if(celestial === this.target)
        {
            EM.RemoveEntity(this);
            celestial.WakeUp();
        }
    }

    InternalUpdate(deltaTime)
    {
        this.fuel = this.maxFuel;
        this.angle = 0;
        /*
        if(this.dockedStation === this.target)
        {
            EM.RemoveEntity(this);
            this.target.WakeUp();
        }*/
    }

    Bounds()
    {
        return { x: 0, y: 0, w: 0, h: 0};
    }

}