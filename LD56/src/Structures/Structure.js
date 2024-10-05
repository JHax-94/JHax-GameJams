import { COLLISION_GROUP, EM } from "../main";
import Citizen from "../TinyCreatures/Citizen";

export default class Structure
{
    constructor(pos)
    {
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

        this.spawnTime = 10;
        this.spawnTimer = 0;

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    AddTargetStructure(structure)
    {
        if(this.targetStructures.indexOf(structure) < 0)
        {
            let spawn = this.targetStructures.length === 0;

            this.targetStructures.push(structure);
            structure.isConnected = true;

            if(spawn)
            {
                this.SpawnBug();
            }
        }
    }

    Update(deltaTime)
    {
        if(this.targetStructures.length > 0)
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

        this.bugLog.push(newBug);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(this.spriteIndex, screenPos.x, screenPos.y);
    }

}