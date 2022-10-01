import { consoleLog, DIRECTIONS, PIXEL_SCALE, UTIL } from "../main";
import Utility from "../Utility";
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
        let playerDirection = player.direction;

        this.sourceTile = player.tilePos;
        let targetTile = { }

        if(playerDirection === DIRECTIONS.UP)
        {
            targetTile.x = this.sourceTile.x;
            targetTile.y = this.sourceTile.y - 1;
        }
        else if(playerDirection === DIRECTIONS.DOWN)
        {
            targetTile.x = this.sourceTile.x;
            targetTile.y = this.sourceTile.y + 1;
        }
        else if(playerDirection === DIRECTIONS.RIGHT)
        {
            targetTile.x = this.sourceTile.x + 1;
            targetTile.y = this.sourceTile.y;            
        }
        else if(playerDirection === DIRECTIONS.LEFT)
        {
            targetTile.x = this.sourceTile.x - 1;
            targetTile.y = this.sourceTile.y;
        }

        this.targetTile = targetTile;
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