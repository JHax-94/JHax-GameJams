import { vec2 } from "p2";
import { COLLISION_GROUP } from "../main";
import TinyCreature from "./TinyCreature";

export default class Scout extends TinyCreature
{
    constructor(pos, parentSwarm)
    {
        super(pos, {
            tag: "PLAYER_BUG", 
            collisionGroup: COLLISION_GROUP.PLAYER, 
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.ENEMY) 
        });

        this.minDist = 0.5;

        this.parentSwarm = parentSwarm;
    }

    Update(deltaTime)
    {
        this.phys.velocity = [ this.parentSwarm.phys.velocity[0], this.parentSwarm.phys.velocity[1]];

        if(vec2.sqrDist(this.phys.position, this.parentSwarm.phys.position) > (this.minDist * this.minDist))
        {
            let targetVec = [ ];
            vec2.sub(targetVec, this.parentSwarm.phys.position, this.phys.position);
            let normedTarget = [];
            vec2.normalize(normedTarget, targetVec);

            this.phys.velocity = [ normedTarget[0] * this.speed, normedTarget[1] * this.speed ];
        }
    }
}