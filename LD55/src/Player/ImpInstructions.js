import { EM, PIXEL_SCALE, SCORES, TILE_HEIGHT, consoleLog } from "../main";

export default class ImpInstructions
{
    constructor(imp)
    {
        this.imp = imp;
    }


    DrawInstructions(frame)
    {
        paper(1);

        let startY = (TILE_HEIGHT / 2) * PIXEL_SCALE;

        let drawAt = {x: frame.x + frame.padding * PIXEL_SCALE, y: frame.y + startY, w: PIXEL_SCALE, h: PIXEL_SCALE};

        let lineHeight = frame.lineHeight;

        let txtOff = 6;
        pen(1);

        let elevator=  this.imp.elevator.GetBoardedElevator();

        if(elevator)
        {
            this.DrawElevatorControls(elevator, drawAt, lineHeight, txtOff);
        }
        else
        {
            this.DrawImpControls(drawAt, lineHeight, txtOff);
        }

        if(this.imp.HasDoor())
        {
            this.DrawDoorInfo(drawAt, lineHeight);
        }
    }

    DrawDoorInfo(drawAt, lineHeight)
    {
        let door = this.imp.door;
        
        if(door.longTitle)
        {
            drawAt.y += PIXEL_SCALE + 8;
            //consoleLog(`Draw door info @ ${drawAt.x}, ${drawAt.y}`);
            let highScore = SCORES.GetHighScore(door.target);
            pen(1);
            print(`Door to ${door.longTitle}...`, drawAt.x, drawAt.y);
            drawAt.y += lineHeight;
            if(highScore > 0) print(`Best Quota: ${(highScore * 100).toFixed(0)}%`, drawAt.x, drawAt.y);
        }
    }

    DrawImpControls(drawAt, lineHeight, txtOff)
    {
        sprite(12, drawAt.x, drawAt.y);
        print("Imp", drawAt.x + PIXEL_SCALE + 4, drawAt.y + txtOff);

        drawAt.y += PIXEL_SCALE;

        sprite(73, drawAt.x, drawAt.y);
        sprite(73, drawAt.x + PIXEL_SCALE, drawAt.y, true );
        print("Move", drawAt.x + 2 * PIXEL_SCALE, drawAt.y + txtOff);

        drawAt.y += PIXEL_SCALE;

        sprite(74, drawAt.x, drawAt.y)
        print("Wings", drawAt.x + PIXEL_SCALE, drawAt.y + txtOff);

        drawAt.y += PIXEL_SCALE

        if(this.imp.HasDoor() || this.imp.elevator.CanInteract())
        {
            sprite(72, drawAt.x, drawAt.y);
            sprite(71, drawAt.x + PIXEL_SCALE, drawAt.y);
            if(this.imp.HasDoor())
            {
                print("open door", drawAt.x + 2 * PIXEL_SCALE, drawAt.y + txtOff);
            }
            else
            {
                print("Board", drawAt.x + 2 * PIXEL_SCALE, drawAt.y + 2);
                print("Elevator", drawAt.x + 2 * PIXEL_SCALE, drawAt.y + 1 + lineHeight);
            }            
        }
        else
        {
            sprite(88, drawAt.x, drawAt.y);
            sprite(87, drawAt.x + PIXEL_SCALE, drawAt.y);
            pen(5);
            print("Interact", drawAt.x + 2* PIXEL_SCALE, drawAt.y + txtOff);
        }
        pen(1);
    }

    DrawElevatorControls(elevator, drawAt, lineHeight, txtOff)
    {
        sprite(28, drawAt.x, drawAt.y);
        print("Elevator", drawAt.x + PIXEL_SCALE + 4, drawAt.y + txtOff);

        drawAt.y += PIXEL_SCALE + 2;

        let elevatorLayer = elevator.GetCurrentFloorNumber();

        let layerStr = elevatorLayer;
        if(elevatorLayer === 0)
        {
            layerStr = "G";
        }
        else if(elevatorLayer < 0)
        {
            layerStr = "B"
        }

        print(`Floor: ${layerStr}`, drawAt.x, drawAt.y);

        drawAt.y += lineHeight;
        
        print(`Passengers: ${elevator.passengers.length} / ${elevator.Capacity()}`, drawAt.x, drawAt.y);

        drawAt.y += lineHeight *2

        print("Doors:", drawAt.x, drawAt.y);
        drawAt.y +=lineHeight;
        print(`L: ${elevator.leftDoorOpen ? 'open' : 'closed'}`, drawAt.x, drawAt.y);
        print(`R: ${elevator.rightDoorOpen ? 'open' : 'closed'}`, drawAt.x + 2 * PIXEL_SCALE + 8, drawAt.y);

        drawAt.y += PIXEL_SCALE;

        sprite(74, drawAt.x, drawAt.y);
        print("UP", drawAt.x + PIXEL_SCALE, drawAt.y + txtOff);

        /*drawAt.y += PIXEL_SCALE;*/

        sprite(75, drawAt.x + 2 *PIXEL_SCALE, drawAt.y);
        print("Down", drawAt.x + 3 * PIXEL_SCALE, drawAt.y + txtOff);

        drawAt.y += PIXEL_SCALE;

        sprite(73, drawAt.x, drawAt.y);
        sprite(73, drawAt.x + PIXEL_SCALE, drawAt.y, true );
        print("Doors", drawAt.x + 2 * PIXEL_SCALE, drawAt.y + txtOff);

        drawAt.y += PIXEL_SCALE;
        sprite(72, drawAt.x, drawAt.y);
        print("Exit Left", drawAt.x + PIXEL_SCALE, drawAt.y + txtOff);
        //print("Left", drawAt.x +PIXEL_SCALE, drawAt.y);

        drawAt.y += PIXEL_SCALE;
        sprite(71, drawAt.x, drawAt.y);
        print("Exit Right", drawAt.x + PIXEL_SCALE, drawAt.y + txtOff);
    }
}