import { vec2 } from "p2";
import { COLLISION_GROUP, consoleLog, EM } from "../main";
import TinyCreature from "./TinyCreature";
import ScoutPerceptionZone from "./ScoutPerceptionZone";

export default class Scout extends TinyCreature
{
    constructor(pos, parentSwarm)
    {
        super(pos, {
            tag: parentSwarm.bugType.tag, 
            perceptionTag: parentSwarm.bugType.perceptionTag,
            collisionGroup: parentSwarm.bugType.collisionGroup, 
            collisionMask: parentSwarm.bugType.collisionMask,
            perceptionMask: parentSwarm.bugType.perceptionMask
        }, 
        parentSwarm.bugType.colours);

        this.minDist = 0.5;

        this.perception = new ScoutPerceptionZone(this);

        this.prey = null;

        this.parentSwarm = parentSwarm;

        /*
        consoleLog(" --- Scout created --- ");
        consoleLog(`CollisionGroup: ${this.phys.shapes[0].collisionGroup}`);
        consoleLog(`CollisionMask: ${this.phys.shapes[0].collisionMask}`);
        consoleLog(`Tag: ${this.phys.tag}`);
        consoleLog(" -- Perception -- ");
        consoleLog(`CollisionGroup: ${this.perception.phys.shapes[0].collisionGroup}`);
        consoleLog(`CollisionMask: ${this.perception.phys.shapes[0].collisionMask}`);
        consoleLog(`Tag: ${this.perception.phys.tag}`);*/
    }

    Despawn()
    {
        super.Despawn();
        if(this.parentSwarm)
        {
            this.parentSwarm.RemoveBug(this);
        }
        EM.RemoveEntity(this.perception);
    }

    PerceiveBug(perceivedBug)
    {
        this.prey = perceivedBug;
    }

    ProcessHitWith(bug)
    {
        bug.Despawn();
        this.Despawn();
    }

    Update(deltaTime)
    {
        if(this.prey)
        {
            let targetVec = [];
            vec2.sub(targetVec, this.prey.phys.position, this.phys.position);
            let normedTarget = [];
            vec2.normalize(normedTarget, targetVec);
            
            this.phys.velocity = [ normedTarget[0] * this.speed, normedTarget[1] * this.speed ];
        }
        else if(vec2.sqrDist(this.phys.position, this.parentSwarm.phys.position) > (this.minDist * this.minDist))
        {
            let targetVec = [ ];
            vec2.sub(targetVec, this.parentSwarm.phys.position, this.phys.position);
            let normedTarget = [];
            vec2.normalize(normedTarget, targetVec);

            this.phys.velocity = [ normedTarget[0] * this.speed, normedTarget[1] * this.speed ];
        }
        else
        {
            this.phys.velocity = [ this.parentSwarm.phys.velocity[0], this.parentSwarm.phys.velocity[1]];
        }
    }
}