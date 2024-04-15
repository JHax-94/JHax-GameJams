import { CONDEMNED_STATE } from "../Enums/CondemnedState";
import TimeStepper from "../TimeStepper";
import ArrowSprite from "../UI/ArrowSprite";
import { EM, PIXEL_SCALE, consoleLog } from "../main";

export default class CondemnedFollowUi
{
    
    constructor(condemned)
    {
        this.renderLayer = "CONDEMNED_UI"
        this.target = condemned;

        this.arrowSprite = new ArrowSprite(20);

        this.activeUi = 0;

        EM.RegisterEntity(this);
    }

    DrawTimeRemainingBar(root)
    {
        let offset = { x: 0, y: 14/16 };

        let height = 3;
        let height2 = 1;

        let barCol = 9;
        let highlight = 10;

        let backColour = 4;
        let borderColour = 0;

        let backWidth = PIXEL_SCALE - 2;

        let barWidth = Math.ceil( (1 - this.target.obliterateTimer.Value()) * (backWidth - 2));

        let base = { x: root.x + offset.x * PIXEL_SCALE, y: root.y + offset.y * PIXEL_SCALE };

        paper(borderColour)
        rectf(base.x, base.y, backWidth, height);
        rectf(base.x + 1, base.y - 1, backWidth - 2, height + 2)

        paper(backColour);
        rectf(base.x + 1, base.y, backWidth-2, height);

        paper(barCol);
        rectf(base.x + 1, base.y, barWidth, height);

        paper(highlight);
        rectf(base.x + 1, base.y, barWidth, height2);
    }

    DrawTravelDirection(root)
    {
        let offset =  { x: 0, y: -1 }

        let targetFloor = this.target.CurrentTargetFloorLayer();
        let currentFloor = this.target.GetCurrentFloorLayerNumber();

        EM.hudLog.push(`${this.target.name} - c: ${currentFloor}, t: ${targetFloor}`);

        let dirFlips = null;

        if(targetFloor > currentFloor)
        {
            dirFlips = this.arrowSprite.up;
        }
        else if(targetFloor < currentFloor)
        {
            dirFlips = this.arrowSprite.down;
        }
        else if(targetFloor === currentFloor)
        {
            let currentTarget = this.target.GetCurrentTarget();
            
            if(currentTarget.phys.position[0] < this.target.phys.position[0])
            {
                dirFlips = this.arrowSprite.left;
            }
            else 
            {
                dirFlips = this.arrowSprite.right;
            }
        }

        if(dirFlips)
        {
            let drawAt = {
                x: root.x + offset.x * PIXEL_SCALE,
                y: root.y + offset.y * PIXEL_SCALE
            }

            sprite(this.arrowSprite.spriteIndex, drawAt.x, drawAt.y, dirFlips.h, dirFlips.v, dirFlips.r);
        }
    }

    ShouldDraw()
    {
        return this.target.ShouldDraw();
    }

    
    ShouldDrawTimeRemaining()
    {
        return !this.target.StateIs(CONDEMNED_STATE.WORKING);
    }

    ShouldDrawTravelDirection()
    {
        return this.target.StateIsAny([CONDEMNED_STATE.QUEUEING]);
    }

    ShouldDrawWorking()
    {
        return this.target.StateIs(CONDEMNED_STATE.WORKING);
    }

    DrawWorking(root)
    {
        paper(0)
        rectf(root.x + 5, root.y - 5, 12, PIXEL_SCALE * 0.5 )
        print("...", root.x + 6, root.y - 4);
    }

    Draw()
    {
        if(this.ShouldDraw())
        {
            let root = this.target.GetScreenPos();

            if(this.ShouldDrawTravelDirection())
            {
                this.DrawTravelDirection(root);
            }

            if(this.ShouldDrawTimeRemaining())
            {
                this.DrawTimeRemainingBar(root);
            }

            if(this.ShouldDrawWorking())
            {
                this.DrawWorking(root);
            }
        }
    }


}