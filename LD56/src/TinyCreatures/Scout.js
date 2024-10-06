import { vec2 } from "p2";
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE } from "../main";
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

        this.dead = false;

        this.onFlower = parentSwarm.bugType.onFlower ?? false;

        this.speed = parentSwarm.bugType.speed;

        this.minDist = 8;

        this.perception = new ScoutPerceptionZone(this);

        this.prey = null;

        this.parentSwarm = parentSwarm;

        this.hiveAttackTime = 1;
        this.hiveAttackTimer = 0;

        this.attackingHive = null;

        this.lifeTime = 0;

        this.offsetAngle = Math.random() * 2 * Math.PI;
        this.angleRate = -1 + 2 * Math.random();

        this.radiusAngle = Math.random() * Math.PI;
        this.radiusRate = Math.random();

        this.targetBugs = [];
        this.targetStructures = [];

        this.swarms = [];

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

    PerceiveSwarm(swarm)
    {
        if(this.swarms.indexOf(swarm) < 0)
        {
            this.swarms.push(swarm);
        }
    }

    UnperceiveSwarm(swarm)
    {
        for(let i = 0; i < this.swarms.length; i++)
        {
            if(this.swarms[i] === swarm)
            {
                this.swarms.splice(i, 1);
                break;
            }
        }
    }

    AttackHive(hive)
    {
        this.attackingHive = hive;
    }

    RemoveAttackHive()
    {
        this.attackingHive = null;
    }

    Despawn()
    {
        super.Despawn();
        if(this.parentSwarm)
        {
            this.parentSwarm.RemoveBug(this);
        }
        EM.RemoveEntity(this.perception);
        this.dead = true;
    }

    CheckPrey()
    {
        let highScore = -1;
        let index = -1;

        //consoleLog(`-- ${this.phys.tag} CHECK PREY --`);

        for(let i = 0; i < this.targetBugs.length; i ++)
        {
            let score = this.PreyScore(this.targetBugs[i]);

            /*consoleLog(`Prey[${i}] with score: ${score}`);
            consoleLog(this.targetBugs[i]);*/

            if(score > highScore)
            {
                highScore = score;
                index = i;
            }
        }

        if(index >= 0)
        {
            /*consoleLog(`Choose Prey[${index}]:`);
            consoleLog(this.targetBugs[index]);*/

            this.prey = this.targetBugs[index];
        }
        else
        {
            /*consoleLog("STOP HUNTING");*/
            this.prey = null;
        }

        consoleLog(`-- ${this.phys.tag} PREY CHECK END -- `);
    }

    PreyScore(bug)
    {
        let score = 0;

        let debugString = "";

        if(!bug.isPlayer)
        {
            score += 2;
            debugString += "notPlayer;";
        }
        else if(!this.parentSwarm.IsHunting(this, bug))
        {
            score += 1;
            debugString += "notHunted";
        }

        return score;

    }

    PerceiveBug(perceivedBug)
    {
        /*consoleLog(" =============== BUG PERCEIVED! ===============");
        consoleLog(perceivedBug);*/

        if(this.targetBugs.indexOf(perceivedBug) < 0)
        {
            this.targetBugs.push(perceivedBug);
        }

        this.CheckPrey();
    }

    RemovePerceivedBug(bug)
    {
        for(let i = 0; i < this.targetBugs.length; i++)
        {
            if(this.targetBugs[i] === bug)
            {
                this.targetBugs.splice(i, 1);
                break;
            }
        }
    }

    CanKillBug(bug)
    {
        /*consoleLog("Kill check on bug");
        consoleLog(bug);
        consoleLog(`Is player: ${bug.isPlayer} Bugs length: ${bug.bugs == null ? "NULL" : bug.bugs.length > 0}`);*/

        let canKill = true;
        if(bug.isPlayer && bug.bugs.length > 0)
        {
            /*consoleLog("BLOCK KILL!");*/
            canKill = false;
        }

        return canKill;
    }

    ProcessHitWith(bug)
    {
        if(this.CanKillBug(bug))
        {
            bug.Despawn();
            this.Despawn();
        }
    }

    Update(deltaTime)
    {
        this.lifeTime += deltaTime;

        if(this.onFlower)
        {
            for(let i = 0; i < this.swarms.length; i ++)
            {
                let swarm = this.swarms[i];
                EM.hudLog.push(`Check swarm ${i} available - P: ${swarm.isPlayer}, ${swarm.bugs.length}/${swarm.maxBugs}`);

                if(swarm.isPlayer && swarm.bugs.length < swarm.maxBugs)
                {
                    this.parentSwarm.RemoveBug(this);
                    this.parentSwarm = swarm;
                    swarm.AddBug(this);
                    this.onFlower = false;
                }
            }
        }

        if(this.prey)
        {
            if(this.prey.dead)
            {
                this.RemovePerceivedBug(this.prey);
                this.prey = null;
                this.CheckPrey();
            }
            else
            {
                let targetVec = [];
                vec2.sub(targetVec, this.prey.phys.position, this.phys.position);
                let normedTarget = [];
                vec2.normalize(normedTarget, targetVec);
                
                this.phys.velocity = [ normedTarget[0] * this.speed, normedTarget[1] * this.speed ];
            }
        }
        else if(this.attackingHive)
        {
            this.hiveAttackTimer += deltaTime;

            if(this.hiveAttackTimer > this.hiveAttackTime)
            {
                this.hiveAttackTimer -= this.hiveAttackTime;

                this.attackingHive.RemovePopulation(1);
                if(this.attackingHive.dead)
                {
                    this.RemoveAttackHive();
                    this.parentSwarm.ResetTarget();
                }
            }
        }
        else
        {
            let targetOffset = this.GetTargetOffset(deltaTime);

            let targetPos = []
            vec2.add(targetPos, targetOffset, this.parentSwarm.phys.position);
            
            let targetVec = [ ];
            vec2.sub(targetVec, targetPos, this.phys.position);
            let normedTarget = [];
            vec2.normalize(normedTarget, targetVec);

            this.phys.velocity = [ normedTarget[0] * this.speed, normedTarget[1] * this.speed ];
        }
        /*else if(vec2.sqrDist(this.phys.position, this.parentSwarm.phys.position) > (this.minDist * this.minDist))
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
        }*/
    }

    GetTargetOffset(deltaTime)
    {
        this.radiusAngle += this.radiusRate * deltaTime;
        this.offsetAngle += this.angleRate * deltaTime;

        let radius = 1.5 * PIXEL_SCALE * Math.sin(this.radiusAngle);
        return [ radius * Math.cos(this.offsetAngle), radius * Math.sin(this.offsetAngle)];
    }

    GetClosestSwarmMate()
    {
        let bugs = this.parentSwarm.bugs;

        let minSqDist = null;

        let closestBug = null;

        for(let i = 0; i < bugs.length; i ++)
        {
            if(bugs[i] !== this)
            {
                let sqDist = vec2.sqrDist(bugs[i].phys.position, this.phys.position);

                if(minSqDist === null || sqDist < minSqDist)
                {
                    minSqDist = sqDist;
                    closestBug = bugs[i];
                }
            }
        }

        if(minSqDist > this.minDist * this.minDist)
        {
            closestBug = null;
        }

        return closestBug;
    }
}