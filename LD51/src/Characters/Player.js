import { consoleLog, DIRECTIONS, EM, getObjectConfig, PIXEL_SCALE, TILE_WIDTH, TURN_PHASES } from "../main";

export default class Player
{
    constructor(spriteData, tilePos, playerNumber)
    {
        this.renderLayer = "WORLD";

        let playerConf = getObjectConfig("Player");

        this.maxHp = playerConf.maxHp;
        this.hp = this.maxHp;

        this.alive = true;
        this.ai = null;

        this.maxActions = playerConf.maxActions;
        this.hitThisAction = false;

        this.flickerTime = playerConf.flickerTime;
        this.flickerOffTime = playerConf.flickerOffTime;
        this.flickerOnTime = playerConf.flickerOnTime;
        this.flickerTimer = 0;

        this.flicker = false;

        this.flickPhase = 0;

        this.startPos = {x: tilePos.x, y: tilePos.y};
        this.tilePos = tilePos;

        this.rootOffset = spriteData.rootOffset;

        this.pos = { x: this.tilePos.x * PIXEL_SCALE, y: this.tilePos.y * PIXEL_SCALE };

        this.spriteData = spriteData;
        this.playerNumber = playerNumber;

        let stanceConfig =  getObjectConfig("Stances");

        this.stances = stanceConfig.stances;

        //this.stance = this.stances[playerNumber === 1 ? 1 : 0 ];
        //this.stance = this.stances[0];
        this.stance = this.stances[random(this.stances.length)];

        //this.direction = this.playerNumber === 1 ? DIRECTIONS.UP : DIRECTIONS.LEFT;
        this.direction = this.playerNumber === 1 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;

        this.currentAction = null;
        this.actionQueue = [];

        this.showIndicator = true;

        this.elapsedTime = 0;

        this.hover = 0;

        EM.RegisterEntity(this);
    }   

    SetAi(ai)
    {
        this.ai = ai;
        this.ai.SetPlayer(this);
    }

    Reset()
    {
        this.alive = true;
        this.elapsedTime = 0;
        this.currentAction = null;
        this.actionQueue = [];
        this.stance = this.stances[random(this.stances.length)];
        this.direction = this.playerNumber === 1 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
        this.hp = this.maxHp;

        this.tilePos = { x: this.startPos.x, y: this.startPos.y };
        this.pos = { x: this.tilePos.x * PIXEL_SCALE, y: this.tilePos.y * PIXEL_SCALE };
    }

    FlowManager()
    {
        if(!this.flowManager)
        {
            this.flowManager = EM.GetEntity("FLOW");
        }

        return this.flowManager;
    }

    Arena()
    {
        if(!this.arena)
        {
            this.arena = EM.GetEntity("ARENA");
        }

        return this.arena;
    }

    AddToActionQueue(action)
    {
        if(this.actionQueue.length < this.maxActions)
        {
            action.actionOrder = this.actionQueue.length;
            this.actionQueue.push(action);
            sfx("command");
        }
    }

    PopActionQueue()
    {
        this.actionQueue.pop();
        sfx("undo");
    }

    ExecuteActionQueue()
    {
        if(this.actionQueue.length > 0 && this.hp > 0)
        {
            this.currentAction = this.actionQueue[0];
            this.currentAction.ExecuteAction(this);
        }
    }

    ActionCompleted(action)
    {
        this.currentAction = null;
        this.hitThisAction = false;

        for(let i = 0; i < this.actionQueue.length; i ++)
        {
            if(this.actionQueue[i] === action)
            {
                this.actionQueue.splice(i, 1);
                break;
            }
        }

        if(this.FlowManager().turnPhase === TURN_PHASES.ACTION)
        {
            if(this.actionQueue.length > 0)
            {
                this.ExecuteActionQueue();
            }
            else
            {
                this.FlowManager().PlayerActionsCompleted(this);
            }
        }   
    }

    Update(deltaTime)
    {
        if(this.alive)
        {
            this.y = this.pos.y;

            if(this.ai)
            {
                this.ai.UpdateAi(deltaTime);
            }

            if(this.currentAction)
            {
                //EM.hudLog.push(`Action: ${this.currentAction.GetProgress()}`);
                this.currentAction.ProgressAction(deltaTime);
            }

            this.elapsedTime += deltaTime;

            this.bob = 2 + Math.sin(Math.PI * this.elapsedTime);

            if(this.flickerTimer > 0)
            {
                this.flickerTimer -= deltaTime;
                this.flickPhase += deltaTime;

                if(this.flicker && this.flickPhase > this.flickerOffTime)
                {
                    this.flicker = false;
                    this.flickPhase = 0;
                }

                if(!this.flicker && this.flickPhase > this.flickerOnTime)
                {
                    this.flicker = true;
                    this.flickPhase = 0;
                }

                if(this.flickerTimer < 0)
                {
                    this.flickerTimer = 0;
                    this.flicker = false;

                    if(this.hp <= 0)
                    {
                        this.PlayerKilled();
                    }
                }
            }
        }
    }
    
    Damage(amount)
    {
        if(!this.hitThisAction)
        {
            this.hitThisAction = true;

            this.hp -= amount;

            if(this.hp <= 0)
            {
                this.hp = 0;
            }
            else if(this.hp > this.maxHp)
            {
                this.hp = this.maxHp;
            }

            this.flicker = true;
            this.flickerTimer = this.flickerTime;
        }
    }

    GetSpriteData()
    {
        let frameSprite  = null;

        if(this.direction === DIRECTIONS.UP)
        {
            frameSprite = this.spriteData.up;
        }
        else if(this.direction === DIRECTIONS.RIGHT)
        {
            frameSprite = this.spriteData.right;
        }
        else if(this.direction === DIRECTIONS.LEFT)
        {
            frameSprite = this.spriteData.left;
        }
        else if(this.direction === DIRECTIONS.DOWN)
        {
            frameSprite = this.spriteData.down;
        }

        return frameSprite;
    }

    ChangeStance(changeDir)
    {
        this.stance = this.GetStanceInDir(changeDir);
    }   
        
    GetMovingToTile()
    {
        let movingToTile = this.tilePos;

        if(this.currentAction && this.currentAction.type === "Move")
        {
            consoleLog(`Player ${this.playerNumber} has move action...`);
            movingToTile = this.currentAction.targetTile;
        }

        return movingToTile;
    }

    GetStanceInDir(changeDir)
    {
        let stance = null;

        for(let i = 0; i < this.stances.length; i ++)
        {
            if((changeDir > 0 && this.stances[i].beats === this.stance.name) ||  (changeDir < 0 && this.stances[i].name === this.stance.beats))
            {
                stance = this.stances[i];
                break;
            }
        }

        return stance;
    }

    CancelCurrentAction()
    {
        consoleLog("Cancel player action...");
        consoleLog(this);
        consoleLog(this.currentAction);
        if(this.currentAction)
        {
            this.currentAction.CancelAction();
        }
    }

    CheckForFloor()
    {
        let tile = this.Arena().GetWorldTile({ x: this.tilePos.x, y: this.tilePos.y });

        if(!EM.tileChecker.IsValidGroundTile(tile))
        {
            sfx("fall");
            this.PlayerKilled();
        }
    }

    PlayerKilled()
    {
        consoleLog("PLAYER DEAD!");
        consoleLog(this);
        this.alive = false;
        this.FlowManager().PlayerKilled(this);
    }

    DrawStanceIndicator()
    {
        if(this.currentAction && this.currentAction.type === "Stance")
        {
            let compSprite = this.currentAction.GetAnimState();

            consoleLog("Anim State:");
            consoleLog(compSprite);

            for(let i = 0; i < compSprite.length; i ++)
            {
                let s = compSprite[i];

                sprite(s.i, (this.pos.x + (this.rootOffset.x) * PIXEL_SCALE + s.x), (this.pos.y + this.rootOffset.y  * PIXEL_SCALE + s.y - PIXEL_SCALE - this.bob));
            }
        }
        else
        {
            let compSprite = this.stance.sprites;

            for(let i = 0; i < compSprite.length; i ++)
            {
                let s = compSprite[i];

                sprite(s.i, (this.pos.x + (s.x + this.rootOffset.x) * PIXEL_SCALE), (this.pos.y + (s.y + this.rootOffset.y)  * PIXEL_SCALE) - PIXEL_SCALE - this.bob, s.h, s.v, s.r);
            }
        }
        
    }

    DrawCompSprite()
    {
        let sprites =  this.GetSpriteData();

        for(let i = 0; i < sprites.length; i ++)
        {
            let s = sprites[i];

            sprite(s.i, this.pos.x + (this.rootOffset.x + s.x) * PIXEL_SCALE, this.pos.y + (this.rootOffset.y  + s.y + this.hover) * PIXEL_SCALE, s.h, s.v, s.r);
        }
    }

    DrawShadow()
    {
        sprite(182, this.pos.x, (this.pos.y + this.rootOffset.y) + 0.325 *PIXEL_SCALE);
    }

    Draw()
    {
        if(this.alive)
        {
            this.DrawShadow();
            if(!this.flicker) 
            {
                this.DrawCompSprite();
            }
            
            this.DrawStanceIndicator();
        }
    }
}