import { COLLISION_GROUP, EM } from "../main";
import Swarm from "./Swarm";

export default class EnemySwarm extends Swarm
{
    constructor(pos)
    {
        super(pos, 
        { 
            tag: "ENEMY_SWARM", 
            collisionGroup: COLLISION_GROUP.ENEMY, 
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.PLAYER | COLLISION_GROUP.ENEMY) 
        });

        this.bugType = {
            colours: [13, 14],
            tag: "ENEMY_BUG",
            collisionGroup: COLLISION_GROUP.ENEMY,
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.PLAYER),
            perceptionTag: "ENEMY_PERCEPTION",
            perceptionMask: COLLISION_GROUP.PLAYER
        };

        this.SpawnBug();
    }

    Update(deltaTime)
    {
        let forward = [0, 1];
        this.phys.vectorToWorldFrame(forward, [0, 1]);
        
        this.phys.angularVelocity = 1;

        this.phys.velocity = [forward[0] * this.speed, forward[1] * this.speed];
    }
}