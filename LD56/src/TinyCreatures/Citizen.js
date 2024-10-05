import { vec2 } from "p2";
import { COLLISION_GROUP, consoleLog, PIXEL_SCALE } from "../main";
import TinyCreature from "./TinyCreature";

export default class Citizen extends TinyCreature
{
    constructor(pos, source, target)
    {
        super(pos, 
        {
            tag: "PLAYER_BUG", 
            collisionGroup: COLLISION_GROUP.PLAYER, 
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.ENEMY) 
        });
        
        this.sourceHive = source;
        this.targetHive = target;

        this.speed = 2 * PIXEL_SCALE;
    }

    StructureTouched(structure)
    {
        consoleLog("Citizen bug collision!");

        if(this.targetHive === structure)
        {
            this.Despawn();
        }
    }

    Despawn()
    {
        super.Despawn();
        this.sourceHive.RemoveBug(this);
    }

    Update(deltaTime)
    {
        let targetVec = [];
        vec2.sub(targetVec, this.targetHive.phys.position, this.phys.position);
        let targetNormed = [];
        vec2.normalize(targetNormed, targetVec);

        this.phys.velocity = [ targetNormed[0] * this.speed, targetNormed[1] * this.speed ];
    }
}