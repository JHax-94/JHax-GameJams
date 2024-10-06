import { vec2 } from "p2";
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main"
import Swarm from "./Swarm";
import PlayerStatusUi from "../UI/PlayerStatusUi";
import Texture from "pixelbox/Texture";

export default class PlayerSwarm extends Swarm
{
    constructor(pos)
    {
        super(pos, 
        { 
            tag: "PLAYER_SWARM", 
            collisionGroup: COLLISION_GROUP.PLAYER, 
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.PLAYER | COLLISION_GROUP.ENEMY) 
        });

        this.isPlayer = true;

        this.bugType = {
            colors: [9, 10],
            tag: "PLAYER_BUG",
            collisionGroup: COLLISION_GROUP.PLAYER,
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.ENEMY),
            perceptionTag: "PLAYER_PERCEPTION",
            perceptionMask: COLLISION_GROUP.ENEMY,
            speed: 2.5 * PIXEL_SCALE
        };

        this.level = 1;
        this.exp = 0;


        this.speed = 3*PIXEL_SCALE;

        this.startHive = null;
        this.lastTouchedStructure = null;

        this.bugSpawnTime = 60;
        this.bugSpawnTimer = 0;
        this.maxBugs = 1;

        this.statusUi = new PlayerStatusUi(this);

        for(let i = 0; i < this.maxBugs; i ++)
        {
            this.SpawnBug();
        }

        this.targetAngle = 0;

        this.mainTexture = this.BuildMainTexture();

    }

    BuildMainTexture()
    {
        let tex = new Texture(PIXEL_SCALE, PIXEL_SCALE);

        tex.sprite(3, 0, 0);

        return tex;

    }

    Despawn()
    {
        consoleLog(">>>> DESPAWN PLAYER <<<<");
        EM.RemoveEntity(this.statusUi);
        EM.RemoveEntity(this);
    }

    IncreaseSwarmSize(amount)
    {
        this.maxBugs += amount;
    }

    DecreaseRespawnTime(amount)
    {
        this.bugSpawnTime = this.bugSpawnTime * (1-amount);
    }

    AddExp(amount)
    {
        this.exp += amount;

        let nextLevel = this.ExpForNextLevel();

        if(this.exp > nextLevel)
        {
            this.level ++;
            this.exp -= nextLevel;

            this.GameWorld().PlayerLevelled();
        }
    }

    ExpForNextLevel()
    {
        let target = this.level;
        
        return target * 5;
    }

    TouchedStructure(structure)
    {
        if(!structure.isEndHive)
        {
            this.lastTouchedStructure = structure;
        }
    }

    GetSourceStructure()
    {
        if(this.lastTouchedStructure)
        {
            return this.lastTouchedStructure;
        }
        else
        {
            if(this.startHive == null)
            {
                this.startHive = EM.GetEntity("START_HIVE");
            }

            return this.startHive;
        }
    }

    

    Input(input)
    {
        let inputVector = { x: 0, y: 0 };

        if(input.right)
        {
            inputVector.x = 1;
        }
        else if(input.left)
        {
            inputVector.x = -1;
        }
        else
        {
            inputVector.x = 0;
        }

        if(input.up)
        {
            inputVector.y = 1;            
        }
        else if(input.down)
        {
            inputVector.y = -1;
        }
        else
        {
            inputVector.y = 0;
        }

        let moveVec = [0,0];
        vec2.normalize(moveVec, [inputVector.x, inputVector.y]);

        this.phys.velocity = [moveVec[0] * this.speed, moveVec[1] * this.speed];

        if(inputVector.x !== 0 || inputVector.y !== 0)
        {
            this.targetAngle = vec2.angleDelta([0, 1], this.phys.velocity);
        }
    }

    SpawnProgress()
    {
        return this.bugSpawnTimer / this.bugSpawnTime;
    }

    SpawningBugs()
    {
        return this.bugs.length < this.maxBugs;
    }

    Update(deltaTime)
    {
        //EM.hudLog.push(`T: ${this.targetAngle.toFixed(3)} C: ${this.phys.angle.toFixed(3)} DL: ${(this.targetAngle - this.phys.angle).toFixed(3)} DR: ${(this.phys.angle - (this.targetAngle + 2*Math.PI)).toFixed(3)}`);

        let angleDiff = this.targetAngle - this.phys.angle;

        if(angleDiff < 0)
        {
            this.phys.angle -= deltaTime;
            if(this.phys.angle < this.targetAngle)
            {
                this.phys.angle = this.targetAngle;
            }  
        }
        else if(angleDiff > 0)
        {
            this.phys.angle += deltaTime;
            if(this.phys.angle > this.targetAngle)
            {
                this.phys.angle = this.targetAngle;
            }  
        }

        let physPos = this.phys.position;

        let hWidth = 0.5 * TILE_WIDTH * PIXEL_SCALE;
        let hHeight = 0.5 * TILE_HEIGHT * PIXEL_SCALE;

        EM.camera.MoveTo(physPos[0]-hWidth, physPos[1]+hHeight);

        if(this.SpawningBugs())
        {
            this.bugSpawnTimer += deltaTime;

            if(this.bugSpawnTimer > this.bugSpawnTime)
            {
                this.bugSpawnTimer -= this.bugSpawnTime;
                this.SpawnBug();

                if(this.bugs.length === this.maxBugs)
                {
                    this.bugSpawnTimer = 0;
                }
            }
        }
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        
        this.mainTexture._drawEnhanced(screenPos.x, screenPos.y, { angle: this.phys.angle, maintainCentre: true });
    }
}