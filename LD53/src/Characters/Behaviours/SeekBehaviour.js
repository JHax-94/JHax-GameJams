import { COLLISION_GROUP, EM, PIXEL_SCALE, consoleLog, formatToFixed, p2 } from "../../main";
import PerceptionRay from "../PerceptionRay";
import BeastBehaviour from "./BeastBehaviour";

let SWEEP_DIRECTION = {
    CLOCK: 1,
    ANTI_CLOCK: -1
}

export default class SeekBehaviour extends BeastBehaviour
{

    constructor(beast, opts)
    {
        super(beast, "SEEK");

        this.travelAngle = 2 * Math.PI * Math.random();
        this.travelVec = [0, 0];

        this.sweepSpeed = 0.4;
        this.scanSpeed = 3;

        this.sweepDirection = random(2) === 0 ? SWEEP_DIRECTION.CLOCK : SWEEP_DIRECTION.ANTI_CLOCK;

        this.perceiveDistance = 2* PIXEL_SCALE;

        if(opts && opts.perceiveDistance)
        {
            this.perceiveDistance = opts.perceiveDistance;
        }

        this.sweptAngle = 0;
        this.perceptionRayLeft = new PerceptionRay(this.beast.phys, [0, 1], this.perceiveDistance, false, COLLISION_GROUP.PLAYER, false);
        this.perceptionRayRight = new PerceptionRay(this.beast.phys, [0, 1], this.perceiveDistance, false, COLLISION_GROUP.PLAYER, false);

        
        this.leftScan = { angle: Math.PI *0.5, min: 0, max: Math.PI * 0.9, direction: 1 };
        this.rightScan = { angle: -Math.PI * 0.5, min: - Math.PI * 0.9, max: 0, direction: 1 };
        
        this.sweepAwayFrom = null;
    }

    FlipSweepDirection()
    {
        this.sweepDirection = (this.sweepDirection === SWEEP_DIRECTION.CLOCK) ? SWEEP_DIRECTION.ANTI_CLOCK : SWEEP_DIRECTION.CLOCK; 
        this.sweptAngle = 0;
    }

    SweepTo(direction)
    {
        if(this.sweepDirection !== direction)
        {
            this.sweepDirection = direction;
            this.sweptAngle = 0;
        }
    }

    UpdateMovementDirection(deltaTime)
    {
        this.travelVec = [ Math.cos(this.travelAngle), Math.sin(this.travelAngle) ];
        let moveForce = this.GetMoveForceVector(this.travelVec, deltaTime, "seek");
        this.beast.phys.applyForce(moveForce);

        let sweep = this.sweepDirection * deltaTime * this.sweepSpeed;

        this.travelAngle += sweep;
        this.sweptAngle += Math.abs(sweep);

        if(this.sweptAngle > 0.5*Math.PI)
        {
            this.FlipSweepDirection();
        }
    }

    UpdatePerception(perceptionRay, angleScan, vector, deltaTime)
    {
        angleScan.angle += angleScan.direction * deltaTime * this.scanSpeed;

        if(angleScan.angle >= angleScan.max)
        {
            angleScan.angle = angleScan.max;
            angleScan.direction = -1;
        }
        else if(angleScan.angle <= angleScan.min)
        {
            angleScan.angle = angleScan.min;
            angleScan.direction = 1;
        }
        
        vector = [Math.cos(this.travelAngle + angleScan.angle), Math.sin(this.travelAngle + angleScan.angle) ];

        EM.hudLog.push(`Angle scan: ${formatToFixed(angleScan.min, 2)} < ${formatToFixed(angleScan.angle, 2)} < ${formatToFixed(angleScan.max, 2)} | (${angleScan.direction})`);

        perceptionRay.SetVec(vector);
        perceptionRay.CalculateCast();
    }

    ProcessPerception()
    {
        let hits = [];

        if(this.perceptionRayLeft.IsHit())
        {
            let leftHit = this.perceptionRayLeft.rayResult.body;

            hits.push(leftHit);

            if(leftHit.tag === "OBSTACLE")
            {
                this.SweepTo(SWEEP_DIRECTION.ANTI_CLOCK);
            }
        }
        
        if(this.perceptionRayRight.IsHit())
        {
            let rightHit = this.perceptionRayRight.rayResult.body;

            hits.push(rightHit);

            if(rightHit.tag === "OBSTACLE")
            {
                this.SweepTo(SWEEP_DIRECTION.CLOCK);
            }
        }

        for(let i = 0; i < hits.length; i ++)
        {
            this.beast.ReactTo({
                stimType: "SEEN",
                seenBody: hits[i]
            });
        }
    }

    Act(deltaTime)
    {
        this.perceived = [];

        this.UpdateMovementDirection(deltaTime);

        this.UpdatePerception(this.perceptionRayLeft, this.leftScan, this.leftVec, deltaTime);
        this.UpdatePerception(this.perceptionRayRight, this.rightScan, this.rightVec, deltaTime);

        this.ProcessPerception();
    }

    DrawIndicators() 
    {
        let targetPos = [];
        let drawScaled = [];

        p2.vec2.scale(drawScaled, this.travelVec, PIXEL_SCALE);

        p2.vec2.add(targetPos, this.beast.phys.position, drawScaled);

        let screenPos = EM.PhysToScreenPos(targetPos);

        paper(15);
        rectf(screenPos.x - 1, screenPos.y - 1, 2, 2);

        this.perceptionRayLeft.DrawRayResult();
        this.perceptionRayRight.DrawRayResult();
    }
}