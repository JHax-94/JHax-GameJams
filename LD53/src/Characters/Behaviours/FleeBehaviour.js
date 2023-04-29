import { PIXEL_SCALE, p2 } from "../../main";
import BeastBehaviour from "./BeastBehaviour";

export default class FleeBehaviour extends BeastBehaviour
{
    constructor(beast, fleeFrom)
    {
        super(beast, "FLEE");

        this.fleeFrom = fleeFrom;

        this.safeDistance = 6 * PIXEL_SCALE;
    }

    GetFleeVector()
    {
        let fleeV = [];

        p2.vec2.subtract(fleeV, this.beast.phys.position, this.fleeFrom.phys.position);
        
        return fleeV;
    }

    Act(deltaTime)
    {
        let fleeVector = this.GetFleeVector();

        if(p2.vec2.sqrLen(fleeVector) >= Math.pow(this.safeDistance, 2))
        {
            this.beast.DefaultBehaviour();
        }
        else
        {
            let force = this.GetMoveForceVector(fleeVector, deltaTime, "flee");

            this.beast.phys.applyForce(force);
        }
    }
}