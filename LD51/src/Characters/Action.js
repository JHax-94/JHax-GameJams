import { consoleLog, DIRECTIONS } from "../main";

export default class Action
{
    constructor(name)
    {
        this.name = name;

        this.actionTime = 1;
        this.actionTimer = 0;
        this.actionComplete = false;
        this.targetPlayer = null;
    }

    ExecuteAction(player)
    {
        consoleLog("ABSTRACT! Perform action on:");
        consoleLog(player);
    }

    ProgressAction(deltaTime)
    {
        if(!this.actionComplete)
        {
            this.actionTimer += deltaTime;
            if(this.actionTimer >= this.actionTime)
            {
                this.actionTimer = this.actionTime;

                this.ActionComplete();
            }
        }
    }

    GetTargetTile(playerDirection, playerTile)
    {
        let targetTile = {x: 0, y: 0};

        if(playerDirection === DIRECTIONS.UP)
        {
            targetTile.x = playerTile.x;
            targetTile.y = playerTile.y - 1;
        }
        else if(playerDirection === DIRECTIONS.DOWN)
        {
            targetTile.x = playerTile.x;
            targetTile.y = playerTile.y + 1;
        }
        else if(playerDirection === DIRECTIONS.RIGHT)
        {
            targetTile.x = playerTile.x + 1;
            targetTile.y = playerTile.y;            
        }
        else if(playerDirection === DIRECTIONS.LEFT)
        {
            targetTile.x = playerTile.x - 1;
            targetTile.y = playerTile.y;
        }

        return targetTile;
    }

    GetProgress()
    {
        return this.actionTimer / this.actionTime; 
    }

    ActionComplete()
    {
        this.actionComplete = true;
        if(this.targetPlayer)
        {
            this.targetPlayer.ActionCompleted(this);
        }
    }
}