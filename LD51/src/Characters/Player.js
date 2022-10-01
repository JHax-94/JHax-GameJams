import { consoleLog, DIRECTIONS, EM, PIXEL_SCALE } from "../main";

export default class Player
{
    constructor(spriteData, tilePos, playerNumber)
    {
        this.renderLayer = "WORLD";

        this.tilePos = tilePos;

        this.pos = { x: this.tilePos.x * PIXEL_SCALE, y: this.tilePos.y * PIXEL_SCALE };

        this.spriteData = spriteData;
        this.playerNumber = playerNumber;

        this.direction = DIRECTIONS.DOWN;

        this.currentAction = null;
        this.actionQueue = [];

        EM.RegisterEntity(this);
    }   

    AddToActionQueue(action)
    {
        this.actionQueue.push(action);
    }

    PopActionQueue()
    {
        this.actionQueue.pop();
    }

    ExecuteActionQueue()
    {
        if(this.actionQueue.length > 0)
        {
            this.currentAction = this.actionQueue[0];
            this.currentAction.ExecuteAction(this);
        }
    }

    ActionCompleted(action)
    {
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
    }

    Update(deltaTime)
    {
        if(this.currentAction)
        {
            EM.hudLog.push(`Action: ${this.currentAction.GetProgress()}`);
            this.currentAction.ProgressAction(deltaTime);
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

    Draw()
    {
        let drawSprite = this.GetSpriteData();
        if(drawSprite)
        {
            sprite(drawSprite.i, this.pos.x, this.pos.y, drawSprite.h, drawSprite.v, drawSprite.r);
        }
        else 
        {
            consoleLog("SPRITE NOT FOUND");
            consoleLog(this);
        }
        
    }
}