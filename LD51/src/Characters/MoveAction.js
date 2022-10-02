import EntityManager from "../EntityManager";
import { consoleLog, EM, PIXEL_SCALE, UTIL } from "../main";
import Action from "./Action";

export default class MoveAction extends Action
{
    constructor()
    {        
        super("Forward", "Move");
        this.sourceTile = null;
        this.targetTile = null;
        this.midpointCheckPassed = false;
    }

    ExecuteAction(player)
    {
        this.targetPlayer = player;
        this.sourceTile = player.tilePos;
        
        this.targetTile = this.GetTargetTile(player.direction, player.tilePos);

        let arena = EM.GetEntity("ARENA");

        let tile = arena.GetWorldTile({ x: this.targetTile.x, y: this.targetTile.y });

        let flow = this.FlowManager();

        let players = flow.GetOtherPlayers(player);

        if(EM.tileChecker.IsWallTile(tile) || this.CheckPlayerOverlap(players, tile))
        {   
            this.targetTile = this.sourceTile;
            this.cancelled = true;
        }
    }

    CheckPlayerOverlap(players, tile)
    {
        let overlap = false;

        if(tile)
        {
            for(let i = 0; i < players.length; i ++)
            {
                if(players[i].tilePos.x === tile.x && players[i].tilePos.y === tile.y)
                {
                    overlap = true;
                    break;
                }

                let movingTo = players[i].GetMovingToTile();

                if(movingTo.x === tile.x && movingTo.y === tile.y)
                {
                    overlap = true;
                    break;
                }
            }
        }   

        return overlap;
    }

    ProgressAction(deltaTime)
    {
        super.ProgressAction(deltaTime);

        if(this.targetTile && this.targetPlayer && !this.cancelled)
        {
            let lerpV = this.GetProgress();

            let newPos = {
                x: UTIL.Lerp(this.sourceTile.x, this.targetTile.x, lerpV) * PIXEL_SCALE,
                y: UTIL.Lerp(this.sourceTile.y, this.targetTile.y, lerpV) * PIXEL_SCALE
            };

            this.targetPlayer.pos = newPos;

            if(lerpV > 0.5 && !this.midpointCheckPassed)
            {
                let explosions = EM.GetEntitiesStartingWith("Explode");

                for(let i = 0; i < explosions.length; i ++)
                {
                    let ex = explosions[i];
                    
                    if(ex.tilePos.x === this.targetTile.x && ex.tilePos.y === this.targetTile.y)
                    {
                        this.ProcessHit(ex.createdBy, this.targetPlayer);
                    }
                }

                this.midpointCheckPassed = true;
            }
        }
    }

    ActionComplete()
    {        
        if(!this.cancelled)
        {
            this.targetPlayer.tilePos = this.targetTile;
            this.targetPlayer.CheckForFloor();
        }

        super.ActionComplete();
    }
}