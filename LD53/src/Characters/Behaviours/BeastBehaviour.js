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

    VectorFromTarget(target)
    {
        let vec = [];
        p2.vec2.subtract(vec, this.beast.phys.position, target);

        return vec;
    }

    GetMoveForceVector(vector, deltaTime, speedType)
    {
        if(!speedType)
        {
            speedType = null;
        }

        if(!deltaTime && deltaTime!==0) console.warn("GetMoveForceVector received null-ish delta time");

        let norm = [];
        p2.vec2.normalize(norm, vector);

        let moveForce = []

        let speedFactor = this.beast.GetSpeed(speedType);

        if(!speedFactor && deltaTime!==0) 
        {
            console.warn(`Null-ish value received for speed type: ${speedType}`);            
        }

        p2.vec2.scale(moveForce, norm, this.beast.GetSpeed(speedType) * deltaTime);

        return moveForce;
    }
    
    Act(deltaTime)
    {
        consoleLog("--- WARNING: BEHAVIOUR ACT UNDEFINED ---");
    }

    DrawIndicators() {}
}