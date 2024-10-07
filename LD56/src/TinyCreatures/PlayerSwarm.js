import { vec2 } from "p2";
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main"
import Swarm from "./Swarm";
import PlayerStatusUi from "../UI/PlayerStatusUi";
import Texture from "pixelbox/Texture";
import PlanBeePauseMenu from "../UI/PlanBeePauseMenu";

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
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.ENEMY | COLLISION_GROUP.PICKUP),
            perceptionTag: "PLAYER_PERCEPTION",
            perceptionMask: (COLLISION_GROUP.ENEMY | COLLISION_GROUP.PICKUP),
            speed: 2.5 * PIXEL_SCALE
        };

        this.level = 1;
        this.exp = 0;

        this.waitForEscUp = false;

        this.waitForWaggleUp = false;
        this.waggleDown = false;

        this.turnSpeed = 2;
        this.speed = 3*PIXEL_SCALE;

        this.startHive = null;
        this.lastTouchedStructure = null;

        this.bugSpawnTime = 60;
        this.bugSpawnTimer = 0;
        this.maxBugs = 3;

        this.isWaggling = false;
        this.waggleMaxAngle = Math.PI / 6;
        this.waggleSpeed = 12;
        this.waggleAmount = 0;
        this.waggleTimer = 0;
        this.waggleUntil = 0;

        this.waitForIncrement = false;

        this.statusUi = new PlayerStatusUi(this);

        for(let i = 0; i < this.maxBugs; i ++)
        {
            this.SpawnBug();
        }

        this.targetAngle = 0;

        this.mainTexture = this.BuildMainTexture();
        this.abdomenTexture = this.BuildAbdomenTexture();
    }

    BuildMainTexture()
    {
        let tex = new Texture(PIXEL_SCALE, PIXEL_SCALE);

        tex.sprite(3, 0, 0);

        return tex;
    }

    BuildAbdomenTexture()
    {
        let tex = new Texture(PIXEL_SCALE, PIXEL_SCALE);
        tex.sprite(19, 0, 0);

        return tex;
    }

    Despawn()
    {
        consoleLog(">>>> DESPAWN PLAYER <<<<");
        EM.RemoveEntity(this.statusUi);
        EM.RemoveEntity(this);

        this.GameWorld().Defeat([ "The pilot bee was killed!" ]);
    }

    Damage() { this.Despawn(); }

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

        if(this.exp >= nextLevel && this.waitForIncrement === false)
        {
            this.waitForIncrement = true;
            this.GameWorld().PlayerLevelled();
            
            /*this.level ++;
            this.exp -= nextLevel;*/
        }
    }

    IncrementLevel()
    {
        this.waitForIncrement = false;
        let nextLevel = this.ExpForNextLevel();
        this.exp -= nextLevel;
        this.level ++;
    }

    ExpForNextLevel()
    {
        let target = this.level;
        
        return target * 3;
    }

    TouchedStructure(structure)
    {
        if(!structure.isEndHive)
        {
            this.lastTouchedStructure = structure;
            this.noSource = false;
        }

        this.WaggleDance();
    }

    GetSourceStructure()
    {
        if(this.lastTouchedStructure)
        {
            return this.lastTouchedStructure;
        }
        else if(!this.noSource)
        {
            if(this.startHive == null)
            {
                this.startHive = EM.GetEntity("START_HIVE");
            }

            return this.startHive;
        }
        else
        {
            return null;
        }
    }

    

    Input(input)
    {

        EM.hudLog.push(`Player input...`);

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

        if(this.waitForWaggleUp === false && input.Waggle)
        {
            this.waitForWaggleUp = true;
        }
        else if(this.waitForWaggleUp && input.Waggle === false)
        {
            this.WaggleDance(true);
            this.waitForWaggleUp = false;
        }

        if(input.esc && !this.waitForEscUp)
        {
            this.waitForEscUp = true;
        }
        else if(!input.esc && this.waitForEscUp)
        {
            this.waitForEscUp = false;

            EM.pauseMenu = new PlanBeePauseMenu();

            EM.Pause(false);
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

    WaggleDance(clearHiveSource = false)
    {
        this.waggleUntil += 1;

        if(clearHiveSource)
        {
            this.ClearHiveSource();
        }
    }

    ClearHiveSource()
    {
        this.lastTouchedStructure = null;
        this.noSource = true;
    }

    CheckSourceStillValid()
    {
        let source = this.GetSourceStructure();

        if(source && source.dead)
        {
            this.ClearHiveSource();
        }
    }

    Update(deltaTime)
    {
        this.CheckSourceStillValid();
        
        if(this.waggleUntil > 0)
        {
            this.waggleUntil -= deltaTime;

            if(this.waggleUntil < 0)
            {
                this.waggleUntil = 0;
            }

            this.waggleTimer += deltaTime * this.waggleSpeed;

            if(this.waggleTimer > 2 * Math.PI)
            {
                this.waggleTimer -= 2 * Math.PI;
            }

            let waggleProgress= Math.sin(this.waggleTimer);

            this.waggleAmount = this.waggleMaxAngle * waggleProgress
        }
        else if(this.waggleTimer > 0)
        {
            this.waggleTimer += deltaTime * this.waggleSpeed;

            if(this.waggleTimer >= 2*Math.PI)
            {
                this.waggleTimer = 0;
            }

            let preWaggleAmount = this.waggleAmount;
            let waggleProgress = Math.sin(this.waggleTimer);

            this.waggleAmount = this.waggleMaxAngle * waggleProgress;
            
            if(preWaggleAmount > 0 && this.waggleAmount < 0 || preWaggleAmount < 0 && this.waggleAmount > 0)
            {
                this.waggleAmount = 0;
                this.waggleTimer = 0;
            }
        }

        //EM.hudLog.push(`Waggle: ${this.waggleUntil.toFixed(3)} (${this.waggleTimer.toFixed(3)})`);

        let angleDiff = this.targetAngle - this.phys.angle;

        let turnAmount = deltaTime * this.turnSpeed;
        
        if(Math.abs(angleDiff) < turnAmount)
        {
            this.phys.angle = this.targetAngle;
        }
        else if((angleDiff < 0 && Math.abs(angleDiff) <= Math.PI) || (angleDiff > 0 && Math.abs(angleDiff) >= Math.PI))
        {
            this.phys.angle -= turnAmount;

            if(this.phys.angle <= -Math.PI)
            {
                this.phys.angle += 2 * Math.PI;
            }
            
            /*
            if(this.phys.angle < this.targetAngle)
            {
                this.phys.angle = this.targetAngle;
                
                consoleLog(`SNAP ANGLE: ${this.phys.angle.toFixed(3)} to ${this.targetAngle.toFixed(3)}`)
            }  */
        }
        else if((angleDiff > 0 && Math.abs(angleDiff) < Math.PI) || (angleDiff < 0 && Math.abs(angleDiff) > Math.PI) )
        {
            this.phys.angle += turnAmount;

            if(this.phys.angle >= Math.PI)
            {
                this.phys.angle -= 2 * Math.PI;
            }

            /*if(this.phys.angle > this.targetAngle)
            {
                consoleLog(`SNAP ANGLE: ${this.phys.angle.toFixed(3)} to ${this.targetAngle.toFixed(3)}`)

                this.phys.angle = this.targetAngle;
            } */ 
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
        this.abdomenTexture._drawEnhanced(screenPos.x, screenPos.y, { angle: this.phys.angle + this.waggleAmount, maintainCentre: true });
    }
}