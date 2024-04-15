import { CONDEMNED_INPUT } from "../Enums/CondemnedInputs";
import ArrowSprite from "../UI/ArrowSprite";
import { EM, PIXEL_SCALE, consoleLog } from "../main";

export default class PassengerFollowUi
{
    constructor(elevator)
    {
        this.renderLayer = "CONDEMNED_UI"
        this.elevator = elevator;
        this.arrowSprite = new ArrowSprite(36);
        EM.RegisterEntity(this);
    }

    GetDrawAt(root, i)
    {
        let offset = { x: i * PIXEL_SCALE, y: 0 };

        if(i < this.elevator.srcTiles.length)
        {
            let tile = this.elevator.srcTiles[i];
            /*
            consoleLog("Draw on src tile: ");
            consoleLog(tile);
            consoleLog(this.elevator.dims);
            */
            offset.x =  (tile.x - this.elevator.dims.x) * PIXEL_SCALE;
            offset.y = (tile.y - this.elevator.dims.y) * PIXEL_SCALE;
        }

        let drawAt = { x: root.x + offset.x, y: root.y + offset.y };

        return drawAt;
    }

    DrawRemainingTime(root, i, passenger)
    {
        let drawAt = this.GetDrawAt(root, i);

        let backColour = 5;
        let barHeight = 2;

        let barCol2 = 9;

        let inset = 2;
        let barFullWidth = PIXEL_SCALE - 2* inset;
        
        drawAt.x += inset;
        drawAt.y += (PIXEL_SCALE - barHeight - 2);

        paper(backColour);
        rectf(drawAt.x, drawAt.y, barFullWidth, barHeight);

        let barWidthMax = barFullWidth - 2;
        let barWidth = (1-passenger.obliterateTimer.Value()) * barWidthMax;

        /*paper(barCol1);
        rectf(drawAt.x + 1, drawAt.y, barWidth, 1);*/

        paper(barCol2);
        rectf(drawAt.x + 1, drawAt.y, barWidth, 2);        
    }

    GetPassengerPosition(passenger)
    {
        let pos = null;

        for(let i = 0; i <this.elevator.passengers.length; i ++)
        {
            if(this.elevator.passengers[i] === passenger)
            {
                pos = this.GetDrawAt(this.elevator.GetScreenPos(), i);
                break;
            }
        }

        return pos;
    }

    DrawPassengerDesiredTravel(root, i, passenger)
    {
        let drawAt = this.GetDrawAt(root, i);

        let currentFloor = this.elevator.GetCurrentFloorNumber();
        let targetFloor = passenger.CurrentTargetFloorLayer();

        let dirFlips = null;

        let canDisembark = this.elevator.CanDisembark();
        let disembark = passenger.GetDesiredDisembark(this.elevator);

        EM.hudLog.push(`P${i}: D? ${!!disembark} | <>${disembark?.dir ?? "NULL"} | T${targetFloor} | C${currentFloor} | G:${canDisembark}`);

        if(disembark && canDisembark)
        {
            if(disembark.dir === CONDEMNED_INPUT.MOVE_LEFT)
            {
                dirFlips = this.arrowSprite.left;
            }
            else if(disembark.dir === CONDEMNED_INPUT.MOVE_RIGHT)
            {
                dirFlips = this.arrowSprite.right;
            }
        }
        else if(targetFloor === currentFloor && !canDisembark)
        {
            dirFlips = this.arrowSprite.down;
        }
        else if(targetFloor > currentFloor)
        {
            dirFlips = this.arrowSprite.up;
        }
        else if(targetFloor < currentFloor)
        {
            dirFlips = this.arrowSprite.down;
        }

        if(dirFlips)
        {
            sprite(this.arrowSprite.spriteIndex, drawAt.x, drawAt.y, dirFlips.h, dirFlips.v, dirFlips.r);
        }
    }    

    Draw()
    {
        let root = this.elevator.GetScreenPos();

        let passengers = this.elevator.passengers;

        for(let i = 0; i < passengers.length; i ++)
        {
            this.DrawPassengerDesiredTravel(root, i, passengers[i]);

            this.DrawRemainingTime(root, i, passengers[i]);
        }
    }
}