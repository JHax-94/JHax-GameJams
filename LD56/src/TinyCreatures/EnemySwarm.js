import { vec2 } from "p2";
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE } from "../main";
import Swarm from "./Swarm";

export default class EnemySwarm extends Swarm
{
    constructor(pos, size, maxSize, spawnTime, lerpRate, convertChance)
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
            perceptionMask: COLLISION_GROUP.PLAYER,
            speed: 3.2 * PIXEL_SCALE
        };

        this.speed = 3.2 * PIXEL_SCALE;

        this.size = size;
        this.maxSize = maxSize;
        this.spawnTime = spawnTime;
        this.spawnTimer = 0;
        this.convertChance = convertChance;

        for(let i = 0; i < size; i ++)
        {
            this.SpawnBug();    
        }

        this.gravLerpRate = lerpRate;

        this.gravLerp = 0;
        this.target = this.FindTarget();
    }

    RemoveBug(bug)
    {
        super.RemoveBug(bug);

        if(this.bugs.length === 0)
        {
            this.GameWorld().SwarmDestroyed(this);
            EM.RemoveEntity(this);
        }
    }

    ResetTarget()
    {
        this.gravLerp = 0;

        this.target = this.FindTarget();
    }

    FindTarget()
    {
        let newTarget = null;

        let nearestHive = this.NearestActiveHive();

        if(nearestHive === null)
        {
            newTarget = this.GameWorld().player;
        }
        else
        {
            newTarget = nearestHive;
        }

        return newTarget;
    }

    NearestActiveHive()
    {
        let activeHives = this.GameWorld().ActiveHives();

        consoleLog("Find target from hives:");
        consoleLog(activeHives);
        let nah = null;

        if(activeHives.length > 0)
        {
            let minDist = null;
            
            for(let i = 0; i < activeHives.length; i ++)
            {
                let hive = activeHives[i];

                if(!hive.isEndHive)
                {
                    if(minDist === null)
                    {
                        nah = hive;
                        minDist = vec2.sqrDist(this.phys.position, hive.phys.position);
                    }
                    else
                    {
                        let sqDist = vec2.sqrDist(this.phys.position, hive.phys.position);

                        if(sqDist < minDist)
                        {
                            nah = hive;
                            minDist = sqDist;
                        }
                    }
                }
            }
        }

        return nah;
    }

    Update(deltaTime)
    {
        //EM.hudLog.push(`gravlerp: ${this.gravLerp.toFixed(3)}`);

        if(this.bugs.length < this.maxSize)
        {
            this.spawnTimer += deltaTime;

            if(this.spawnTimer >= this.spawnTime)
            {
                this.spawnTimer -= this.spawnTime;

                this.SpawnBug();
            }
        }

        if(this.target)
        {
            if(this.target.IsActive && !this.target.IsActive())
            {
                this.ResetTarget();
            }

            if(this.gravLerp < 1)
            {
                this.gravLerp += deltaTime * this.gravLerpRate;

                if(this.gravLerp > 1)
                {
                    this.gravLerp = 1;
                }
            }
            
            let forward = [0, 1];
            this.phys.vectorToWorldFrame(forward, [0, 1]);
            
            this.phys.angularVelocity = 1;

            //this.phys.velocity = [forward[0] * this.speed, forward[1] * this.speed];

            let vecToTarget = [];
            vec2.sub(vecToTarget, this.target.phys.position, this.phys.position);
            let normedTarget = [];
            vec2.normalize(normedTarget, vecToTarget);

            let lerped = [ 
                forward[0] + (normedTarget[0] - forward[0]) * this.gravLerp, 
                forward[1] + (normedTarget[1] - forward[1]) * this.gravLerp
                /*normedTarget[0],
                normedTarget[1]*/
            ];

            vec2.scale(lerped, lerped, this.speed);

            //EM.hudLog.push(`SwarmV: (${lerped[0].toFixed(3)}, ${lerped[1].toFixed(3)})`);
            this.phys.velocity = [lerped[0], lerped[1]];

            //EM.hudLog.push(`TargetV: (${normedTarget[0].toFixed(3)}, ${normedTarget[1].toFixed(3)})`);
        }
    }
}