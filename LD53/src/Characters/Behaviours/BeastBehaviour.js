import p2 from "p2";
import { consoleLog } from "../../main";

export default class BeastBehaviour
{
    constructor(beast, behaviourType)
    {
        this.beast = beast;
        this.behaviourType = behaviourType;
    }

    VectorToTarget(target)
    {
        let vec = [];

        p2.vec2.subtract(vec, target, this.beast.phys.position);
        
        return vec;
    }

    GetMoveForceVector(vector, deltaTime, speedType)
    {
        if(!deltaTime && deltaTime!==0) console.warn("GetMoveForceVector received null-ish delta time");

        let norm = [];
        p2.vec2.normalize(norm, vector);

        let moveForce = []
        p2.vec2.scale(moveForce, norm, this.beast.GetSpeed(speedType) * deltaTime);

        return moveForce;
    }
    
    Act(deltaTime)
    {
        consoleLog("--- WARNING: BEHAVIOUR ACT UNDEFINED ---");
    }

    DrawIndicators() {}
}