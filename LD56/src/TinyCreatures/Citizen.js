import { vec2 } from "p2";
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE } from "../main";
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
        },
        [
            11, 0
        ]);
        
        this.speed = this.GameWorld().citizenSpeed;

        this.sourceHive = source;
        this.targetHive = target;
    }

    ProcessHitWith(bug)
    {
        if(Math.random() < bug.parentSwarm.convertChance)
        {
            bug.parentSwarm.ConvertBug(this);
        }
        else 
        {
            this.Despawn(true);
        }
    }

    Refresh()
    {
        super.Refresh();
        this.speed = this.GameWorld().citizenSpeed;
    }

    StructureTouched(structure)
    {
        //consoleLog("Citizen bug collision!");
        let popCount = 1;
        if(this.targetHive === structure && structure.CanAddPopulation(popCount))
        {
            structure.AddPopulation(popCount);
            this.Despawn();
        }
    }

    Despawn(showWarning = false)
    {
        //consoleLog(`--- DESPAWN CITIZEN | Warn? ${showWarning} ---`);
        super.Despawn();
        this.sourceHive.RemoveBug(this);

        if(showWarning) this.GameWorld().warningTracker.AddWarning(this);
    }

    Update(deltaTime)
    {
        let targetVec = [];
        vec2.sub(targetVec, this.targetHive.phys.position, this.phys.position);
        let targetNormed = [];
        vec2.normalize(targetNormed, targetVec);

        this.phys.velocity = [ targetNormed[0] * this.speed, targetNormed[1] * this.speed ];

        //EM.hudLog.push(`Cit Speed: ${vec2.length(this.phys.velocity).toFixed(3)}`);
    }
}