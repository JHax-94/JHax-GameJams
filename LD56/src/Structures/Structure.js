import { COLLISION_GROUP, consoleLog, EM, getFont, PIXEL_SCALE, setFont, UTIL } from "../main";
import Citizen from "../TinyCreatures/Citizen";
import PathIndicator from "./PathIndicator";


export default class Structure
{
    constructor(pos)
    {
        this.isEndHive = false;
        this.gameWorld = null;
        this.player = null;
        this.maxPopulation = 100;
        this.population = 0;

        this.deadSprite = 0;
        this.dead = false;

        this.spriteIndex = 1;
        this.isConnected = false;        
        this.targetStructures = [];
        this.currentTarget = 0;

        this.bugLog = [];

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: 1, h: 1 },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: "HIVE",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.STRUCTURE,
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.PLAYER | COLLISION_GROUP.ENEMY),
            linearDrag: 0.99
        };

        this.spawnTime = 2;
        this.spawnTimer = 0;

        this.minReplenish = 5;

        this.maxReplenishTime = 12;
        this.minReplenishTime = 3;
        this.replenishTimer = 0;

        this.font = getFont("Default");

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    ReplenishTime()
    {
        let factor = null;
        
        if(this.population >= this.minReplenish && this.population < this.maxPopulation)
        {
            factor = (this.population - this.minReplenish) / (this.maxPopulation - this.minReplenish);  
            //EM.hudLog.push(`replenish factor: ${factor.toFixed(3)}`);
        } 

        return factor ? this.minReplenish + (1 - factor) * (this.maxReplenishTime - this.minReplenish) : null;
    }

    Replenish()
    {
        consoleLog("REPLENISH!");
        this.population ++;
    }

    IsActive()
    {
        return this.population > 0 && this.dead === false;
    }

    RefreshCitizens()
    {
        for(let i = 0; i < this.bugLog.length; i ++)
        {
            this.bugLog[i].Refresh();
        }
    }

    GameWorld()
    {
        if(this.gameWorld === null)
        {
            this.gameWorld = EM.GetEntity("GAMEWORLD");
        }

        return this.gameWorld;
    }

    Player()
    {
        if(this.player === null)
        {
            this.player = this.GameWorld().player;
        }

        return this.player;
    }

    AddTargetStructure(structure)
    {
        if(this.targetStructures.indexOf(structure) < 0)
        {
            let spawn = (this.targetStructures.length === 0 && this.population > this.minReplenish);

            this.targetStructures.push(structure);
            this.connectors = new PathIndicator(structure, this);

            structure.isConnected = true;

            if(spawn)
            {
                this.SpawnBug();
            }
        }
    }

    SpawnTimeModifier()
    {
        let spawnTimeModifier = 0;

        if(this.targetStructures.length > 1)
        {
            let n = this.targetStructures.length - 1;

            for(let i = 1; i <= n; i ++)
            {
                spawnTimeModifier += 1/(i+1);
            }
        }

        return spawnTimeModifier;
        
    }

    SpawnTimeRemaining()
    {
        let spawnTime = this.spawnTime - this.SpawnTimeModifier();

        /*if(this.population < this.minReplenish && this.targetStructures.length <= 1)
        {
            spawnTime = spawnTime * 2;
        }*/

        return spawnTime;
    }

    Update(deltaTime)
    {
        if(!this.dead)
        {
            //EM.hudLog.push(`-HIVE- T: ${this.targetStructures.length} P: ${this.population}`);
            if(this.targetStructures.length > 0 && this.population > 0)
            {
                //EM.hudLog.push(`Spawn time: ${this.spawnTimer.toFixed(3)} / ${this.SpawnTimeRemaining().toFixed(3)}`);

                this.spawnTimer += deltaTime;

                if(this.spawnTimer > this.SpawnTimeRemaining())
                {
                    this.spawnTimer -= this.SpawnTimeRemaining();

                    if(this.targetStructures[this.currentTarget].population < this.targetStructures[this.currentTarget].maxPopulation)
                    {
                        this.SpawnBug();
                    }
                }
            }    

            let replenishTime = this.ReplenishTime();

            if(replenishTime > 0)
            {
                EM.hudLog.push(`Replenish: ${this.replenishTimer.toFixed(3)}/${replenishTime.toFixed(3)}`);

                this.replenishTimer += deltaTime;

                if(this.replenishTimer > replenishTime)
                {
                    this.replenishTimer = 0;
                    this.Replenish();
                }
            }
        }
        else
        {
            EM.hudLog.push(`-DEAD-`);
        }
    }

    RemoveBug(bug)
    {
        for(let i = 0; i < this.bugLog.length; i ++)
        {
            if(this.bugLog[i] === bug)
            {
                this.bugLog.splice(i, 1);
                break;
            }
        }
    }

    Kill()
    {
        console.warn("-HIVE KILLED-");
        this.dead = true;
    }

    SpawnBug()
    {
        let tilePos = this.GetTilePos();

        let targetStructure = this.targetStructures[this.currentTarget];

        let newBug = new Citizen(tilePos, this, targetStructure);

        this.population --;

        this.currentTarget = (this.currentTarget + 1) % this.targetStructures.length;

        if(this.population <= 0 && this.GameWorld().HiveSupplied(this) === false)
        {
            this.Kill();
        }

        this.bugLog.push(newBug);
    }

    CanAddPopulation(addPop)
    {
        return this.population + addPop <= this.maxPopulation;
    }

    AddPopulation(addPop)
    {
        this.population += addPop;
        this.GameWorld().AddExpToPlayer(addPop);
    }

    RemovePopulation(amount)
    {
        this.population -= amount;
        
        if(this.population < 0)
        {
            this.population = 0;
            this.Kill();
        }
    }

    DrawHighlight(screenPos)
    {

    }

    Draw()
    {
        setFont(this.font);

        let screenPos = this.GetScreenPos();

        let spriteIndex = this.dead ? this.deadSprite : this.spriteIndex;

        sprite(spriteIndex, screenPos.x, screenPos.y);

        let popString = `${this.population}/${this.maxPopulation}`;

        let tw = UTIL.GetTextWidth(popString, this.font);
        let th = UTIL.GetTextHeight(popString, this.font);

        if(this.Player().GetSourceStructure() === this) this.DrawHighlight(screenPos);

        pen(1);
        print(popString, screenPos.x + 0.5 * (1 - tw) * PIXEL_SCALE, screenPos.y-th*PIXEL_SCALE - 4);
    }

}