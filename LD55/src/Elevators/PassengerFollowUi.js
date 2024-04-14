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

    DrawPassengerDesiredTravel(root, i, passenger)
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

        let currentFloor = this.elevator.GetCurrentFloorNumber();
        let targetFloor = passenger.CurrentTargetFloorLayer();

        let dirFlips = null;

        if(targetFloor > currentFloor)
        {
            dirFlips = this.arrowSprite.up;
        }
        else if(targetFloor < currentFloor)
        {
            dirFlips = this.arrowSprite.down;
        }
        else
        {
            let targetWorkstation = passenger.GetCurrentTargetWorkstation();

            /*consoleLog("Check departure side:");
            consoleLog(targetWorkstation);*/

            if(targetWorkstation.phys.position[0] < this.elevator.phys.position[0])
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
        }
    }
}