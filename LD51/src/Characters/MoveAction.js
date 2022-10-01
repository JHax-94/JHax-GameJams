import { consoleLog, DIRECTIONS, EM, PIXEL_SCALE, UTIL } from "../main";
import Action from "./Action";

export default class MoveAction extends Action
{
    constructor()
    {        
        super("FWD");
        this.sourceTile = null;
        this.targetTile = null;
        this.cancelled = false;
    }

    ExecuteAction(player)
    {
        this.targetPlayer = player;
        this.sourceTile = player.tilePos;
        
        this.targetTile = this.GetTargetTile(player.direction, player.tilePos);

        let arena = EM.GetEntity("ARENA");

        let tile = arena.GetWorldTile({ x: this.targetTile.x, y: this.targetTile.y });

        if(EM.tileChecker.IsWallTile(tile))
        {   
            consoleLog("CANCEL ACTION! TARGET TILE NOT VALID");

            this.targetTile = this.sourceTile;
            this.cancelled = true;
        }
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
        }
    }

    ActionComplete()
    {        
        this.targetPlayer.tilePos = this.targetTile;

        super.ActionComplete();
    }
}