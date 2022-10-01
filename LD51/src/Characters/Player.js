import { consoleLog, DIRECTIONS, EM, PIXEL_SCALE } from "../main";

export default class Player
{
    constructor(spriteData, tilePos, playerNumber)
    {
        this.renderLayer = "WORLD";

        this.tilePos = tilePos;

        this.pos = { x: this.tilePos.x * PIXEL_SCALE, y: this.tilePos.y * PIXEL_SCALE };

        this.spriteIndex = spriteData.spriteIndex;
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

    Draw()
    {
        sprite(this.spriteIndex, this.pos.x, this.pos.y);
    }
}