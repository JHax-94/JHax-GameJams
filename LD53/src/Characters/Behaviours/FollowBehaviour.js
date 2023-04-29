import p2 from "p2";
import BeastBehaviour from "./BeastBehaviour";
import { EM, PIXEL_SCALE, formatToFixed } from "../../main";

export default class FollowBehaviour extends BeastBehaviour
{
    constructor(beast, target)
    {
        super(beast, "FOLLOW");
        this.target = target;
        this.followToDistance = 2*PIXEL_SCALE;
    }

    MoveToTarget (deltaTime)
    {
        let moveVec = this.VectorToTarget(this.target.phys.position);

        let dist = p2.vec2.sqrLen(moveVec);

        let minDist = Math.pow(this.followToDistance, 2);

        if(dist > minDist)
        {
            let force = this.GetMoveForceVector(moveVec, deltaTime, "follow");

            this.beast.phys.applyForce(force);
        }
        else
        {
            //let force = this.GetMoveForceVector([ this.target.phys.force[0], this.target.phys.force[1] ], deltaTime);

            //this.beast.phys.applyForce(force);
        }
    }

    Act(deltaTime)
    {
        if(this.target.deleted)
        {
            this.beast.DefaultBehaviour();
        }
        else
        {
            this.MoveToTarget(deltaTime);    
        }
    }
}