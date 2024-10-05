import { COLLISION_GROUP, EM, PIXEL_SCALE, UTIL } from "../main";
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

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    IsActive()
    {
        return this.population > 0;
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
            let spawn = this.targetStructures.length === 0;

            this.targetStructures.push(structure);
            this.connectors = new PathIndicator(structure, this);

            structure.isConnected = true;

            if(spawn)
            {
                this.SpawnBug();
            }
        }
    }

    Update(deltaTime)
    {
        if(this.targetStructures.length > 0 && this.population > 0)
        {
            this.spawnTimer += deltaTime;

            if(this.spawnTimer > this.spawnTime)
            {
                this.spawnTimer -= this.spawnTime;
                this.SpawnBug();

            }
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

    SpawnBug()
    {
        let tilePos = this.GetTilePos();

        let targetStructure = this.targetStructures[this.currentTarget];

        let newBug = new Citizen(tilePos, this, targetStructure);

        this.population --;

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

    DrawHighlight(screenPos)
    {

    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(this.spriteIndex, screenPos.x, screenPos.y);

        let popString = `${this.population}/${this.maxPopulation}`;

        let tw = UTIL.GetTextWidth(popString, null);
        let th = UTIL.GetTextHeight(popString, null);

        if(this.Player().GetSourceStructure() === this) this.DrawHighlight(screenPos);

        pen(1);
        print(popString, screenPos.x + 0.5 * (1 - tw) * PIXEL_SCALE, screenPos.y-th*PIXEL_SCALE - 4);

        


    }

}