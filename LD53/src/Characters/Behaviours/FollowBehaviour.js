import p2 from "p2";
import BeastBehaviour from "./BeastBehaviour";
import { EM, PIXEL_SCALE, formatToFixed } from "../../main";

export default class FollowBehaviour extends BeastBehaviour
{
    constructor(beast, target, opts)
    {
        super(beast, "FOLLOW");
        this.target = target;

        this.minDistance = 1.5 * PIXEL_SCALE;

        if(opts && (opts.minDist || opts.minDist === 0))
        {
            opts.minDist = opts.minDist;
        }

        this.followToDistance = 2.5 * PIXEL_SCALE;

        if(opts && (opts.followToDistance || opts.followToDistance === 0))
        {
            this.followToDistance = opts.followToDistance;
        }
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
        else if(dist <  Math.pow(this.minDistance, 2))
        {
            let spaceVector = this.VectorFromTarget(this.target.phys.position);

            //console.log(`Space vector: (${spaceVector[0]}, ${spaceVector[1]})`);
            let force = this.GetMoveForceVector(spaceVector, deltaTime);

            //console.log(`Force: (${force[0]}, ${force[1]})`);
            this.beast.phys.applyForce(force);
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