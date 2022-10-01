import { consoleLog, DIRECTIONS, EM, getObjectConfig, PIXEL_SCALE, TILE_WIDTH } from "../main";

export default class Player
{
    constructor(spriteData, tilePos, playerNumber)
    {
        this.renderLayer = "WORLD";

        let playerConf = getObjectConfig("Player");

        this.maxHp = playerConf.maxHp;
        this.hp = this.maxHp;

        this.maxActions = playerConf.maxActions;

        this.flickerTime = playerConf.flickerTime;
        this.flickerOffTime = playerConf.flickerOffTime;
        this.flickerOnTime = playerConf.flickerOnTime;
        this.flickerTimer = 0;

        this.flicker = false;

        this.flickPhase = 0;

        this.tilePos = tilePos;

        this.pos = { x: this.tilePos.x * PIXEL_SCALE, y: this.tilePos.y * PIXEL_SCALE };

        this.spriteData = spriteData;
        this.playerNumber = playerNumber;

        let stanceConfig =  getObjectConfig("Stances");

        this.stances = stanceConfig.stances;

        this.stance = this.stances[random(this.stances.length)];

        this.direction = this.playerNumber === 1 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;

        this.currentAction = null;
        this.actionQueue = [];

        this.elapsedTime = 0;

        EM.RegisterEntity(this);
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
        }
    }

    PopActionQueue()
    {
        this.actionQueue.pop();
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

        for(let i = 0; i < this.actionQueue.length; i ++)
        {
            if(this.actionQueue[i] === action)
            {
                this.actionQueue.splice(i, 1);
                break;
            }
        }

        if(this.actionQueue.length > 0)
        {
            this.ExecuteActionQueue();
        }
        else
        {
            this.FlowManager().PlayerActionsCompleted(this);
        }
    }

    Update(deltaTime)
    {
        if(this.currentAction)
        {
            //EM.hudLog.push(`Action: ${this.currentAction.GetProgress()}`);
            this.currentAction.ProgressAction(deltaTime);
        }

        this.elapsedTime += deltaTime;

        this.bob = 1 + Math.sin(Math.PI * this.elapsedTime);

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

                if(this.hp < 0)
                {
                    this.PlayerKilled();
                }
            }
        }
        
    }
    
    Damage(amount)
    {
        this.hp -= amount;

        if(this.hp < 0)
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
        for(let i = 0; i < this.stances.length; i ++)
        {
            if((changeDir > 0 && this.stances[i].beats === this.stance.name) ||  (changeDir < 0 && this.stances[i].name === this.stance.beats))
            {
                this.stance = this.stances[i];
                break;
            }
        }
    }
        
    CancelCurrentAction()
    {
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
            this.PlayerKilled();
        }
    }

    PlayerKilled()
    {
        EM.RemoveEntity(this);
    }

    Draw()
    {
        let drawSprite = this.GetSpriteData();
        
        if(!this.flicker) 
        {
            sprite(drawSprite.i, this.pos.x, this.pos.y, drawSprite.h, drawSprite.v, drawSprite.r);
        }
        sprite(this.stance.sprite, this.pos.x, this.pos.y - PIXEL_SCALE - this.bob);

        //print(`P${this.playerNumber} HP: ${this.hp}/${this.maxHp}`, (TILE_WIDTH - 5) * PIXEL_SCALE, (this.playerNumber-1) * PIXEL_SCALE);
    }
}