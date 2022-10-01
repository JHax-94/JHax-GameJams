import { consoleLog, DIRECTIONS, PIXEL_SCALE, UTIL } from "../main";
import Action from "./Action";

export default class MoveAction extends Action
{
    constructor()
    {
        super("FWD");
        this.sourceTile = null;
        this.targetTile = null;
    }

    ExecuteAction(player)
    {
        this.targetPlayer = player;
        this.sourceTile = player.tilePos;
        
        this.targetTile = this.GetTargetTile(player.direction, player.tilePos);
    }

    ProgressAction(deltaTime)
    {
        super.ProgressAction(deltaTime);

        if(this.targetTile && this.targetPlayer)
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