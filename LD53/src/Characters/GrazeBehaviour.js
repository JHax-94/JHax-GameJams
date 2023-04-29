import p2 from "p2";
import BeastBehaviour from "./BeastBehaviour";
import { EM, consoleLog } from "../main";

export default class GrazeBehaviour extends BeastBehaviour
{
    constructor(beast)
    {
        super(beast, "GRAZE");
        
        this.amblePosition = [0, 0];
        this.ambleRadius = 0.5;

        this.idleTime = 1 + Math.random() * 1;
        this.idleTimer = 1;
    }

    SetGoal()
    {
        let wanderAngle = 2 * Math.PI * Math.random();
        
        let wanderMag = 10 + Math.random() * 50;

        let targetVec = [ wanderMag * Math.cos(wanderAngle),  wanderMag * Math.sin(wanderAngle) ];

        let targetPos = [];
        
        p2.vec2.add(targetPos, this.beast.phys.position, targetVec);

        this.amblePosition = [targetPos[0], targetPos[1]];
    }

    Idle(deltaTime)
    {
        this.idleTimer -= deltaTime;

        if(this.idleTimer < 0)
        {
            this.SetGoal();

            this.idleTimer = 0;
        }
    }

    MoveToTarget(deltaTime)
    {
        let moveVec = this.VectorToTarget(this.amblePosition);

        if(p2.vec2.sqrLen(moveVec) < Math.pow(this.ambleRadius, 2))
        {
            this.idleTimer = 1 + Math.random() * 2;
        }
        else
        {
            let force = this.GetMoveForceVector(moveVec, deltaTime, "graze");
            this.beast.phys.applyForce(force);
        }
    }

    Act(deltaTime)
    {
        if(this.idleTimer > 0)
        {
            this.Idle(deltaTime);
        }
        else 
        {
            this.MoveToTarget(deltaTime);
        }
    }

    DrawIndicators()
    {
        if(this.idleTimer <= 0)
        {
            paper(9);

            let screenPos = EM.PhysToScreenPos(this.amblePosition);
            rectf(screenPos.x - 1, screenPos.y -1, 2, 2);
        }
    }
}