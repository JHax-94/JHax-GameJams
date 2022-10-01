import { consoleLog, DIRECTIONS, EM, PIXEL_SCALE, REVERSE_DIRECTION, UTIL } from "../main";

export default class Action
{
    constructor(name)
    {
        this.name = name;

        this.actionTime = 1;
        this.actionTimer = 0;
        this.actionComplete = false;
        this.targetPlayer = null;

        this.cancelled = false;

        this.bounceList = [];
    }

    FlowManager()
    {
        if(!this.flowManager)
        {
            this.flowManager = EM.GetEntity("FLOW");
        }

        return this.flowManager;
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

            for(let i = 0; i < this.bounceList.length; i ++)
            {
                let bounce = this.bounceList[i];

                bounce.targetPlayer.pos = { 
                    x: UTIL.Lerp(bounce.rootPos.x, bounce.destinationTile.x * PIXEL_SCALE, this.GetAdjustedProgress(bounce.startTime)),
                    y: UTIL.Lerp(bounce.rootPos.y, bounce.destinationTile.y * PIXEL_SCALE, this.GetAdjustedProgress(bounce.startTime))
                };

                let bestFitTile = {
                    x: Math.round(bounce.targetPlayer.pos.x / PIXEL_SCALE),
                    y: Math.round(bounce.targetPlayer.pos.y / PIXEL_SCALE)
                }

                if(bounce.targetPlayer.tilePos.x !== bestFitTile.x)
                {
                    bounce.targetPlayer.tilePos.x = bestFitTile.x;
                }
                
                if(bounce.targetPlayer.tilePos.y !== bestFitTile.y)
                {
                    bounce.targetPlayer.tilePos.y = bestFitTile.y;
                }

                if(this.actionComplete)
                {
                    bounce.targetPlayer.tilePos = bounce.destinationTile;
                    bounce.targetPlayer.pos = { x: bounce.destinationTile.x * PIXEL_SCALE, y: bounce.destinationTile.y * PIXEL_SCALE };

                    bounce.targetPlayer.CheckForFloor();
                }
            }
        }
    }

    ProcessHit(sourcePlayer, hitPlayer)
    {
        consoleLog("Source:");
        consoleLog(sourcePlayer);
        consoleLog("Hit");
        consoleLog(hitPlayer);

        consoleLog("Player hit! Compare stances!");
        consoleLog(`Attacker: ${sourcePlayer.stance.name} - Attackee: ${hitPlayer.stance.name}`);
        
        if(sourcePlayer.stance.name === hitPlayer.stance.name)
        {
            /// EQUAL STANCE ATTACK
            // Each player bounces back 1 tile
            
            consoleLog("Neutral bounce!");

            this.BouncePlayer(sourcePlayer, REVERSE_DIRECTION(sourcePlayer.direction), 1);
            this.BouncePlayer(hitPlayer, sourcePlayer.direction, 1);
            sourcePlayer.CancelCurrentAction();
            hitPlayer.CancelCurrentAction();
        }
        else if(sourcePlayer.stance.name === hitPlayer.stance.beats)
        {
            consoleLog("Backfire bounce!");
            this.BouncePlayer(sourcePlayer, REVERSE_DIRECTION(sourcePlayer.direction), 2);
            sourcePlayer.CancelCurrentAction();
        }
        else if(sourcePlayer.stance.beats === hitPlayer.stance.name)
        {
            consoleLog("Success bounce!");

            /// ATTACK WIN
            // Enemy takes a hit and bounces back 2 tiles
            this.BouncePlayer(hitPlayer, sourcePlayer.direction, 2);
            hitPlayer.CancelCurrentAction();
            hitPlayer.Damage(1);
        }
    }

    CheckForHits(sourcePlayer, targetTile)
    {
        let flowManager = this.FlowManager();

        let otherPlayers = flowManager.GetOtherPlayers(sourcePlayer);

        for(let i = 0; i < otherPlayers.length; i ++)
        {
            let hitPlayer = otherPlayers[i];
            
            consoleLog("Check player is hit?");
            consoleLog(hitPlayer);
            
            if(hitPlayer.tilePos.x === targetTile.x && hitPlayer.tilePos.y === targetTile.y)
            {
                this.ProcessHit(sourcePlayer, hitPlayer);
            }
        }
    }

    GetTargetTile(playerDirection, playerTile, distance)
    {
        if(!distance)
        {
            distance = 1;
        }

        let targetTile = {x: 0, y: 0};

        if(playerDirection === DIRECTIONS.UP)
        {
            targetTile.x = playerTile.x;
            targetTile.y = playerTile.y - distance;
        }
        else if(playerDirection === DIRECTIONS.DOWN)
        {
            targetTile.x = playerTile.x;
            targetTile.y = playerTile.y + distance;
        }
        else if(playerDirection === DIRECTIONS.RIGHT)
        {
            targetTile.x = playerTile.x + distance;
            targetTile.y = playerTile.y;            
        }
        else if(playerDirection === DIRECTIONS.LEFT)
        {
            targetTile.x = playerTile.x - distance;
            targetTile.y = playerTile.y;
        }

        return targetTile;
    }

    GetProgress()
    {
        return this.actionTimer / this.actionTime; 
    }

    GetAdjustedProgress(startTime)
    {
        return (this.actionTimer - startTime) / (this.actionTime - startTime);
    }

    BouncePlayer(player, bounceDirection, bounceDistance)
    {
        let rootPos = player.pos;
        let rootTile = player.tilePos;

        let targetTile = this.GetTargetTile(bounceDirection, rootTile, bounceDistance);

        let newBounce = { 
            startTime: this.actionTimer,
            rootPos: rootPos,
            destinationTile: targetTile,
            targetPlayer: player
        };

        consoleLog("Add bounce to list...");
        consoleLog(newBounce);

        this.bounceList.push(newBounce);        
    }

    CancelAction()
    {
        this.cancelled = true;
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