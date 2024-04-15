import { EM, PIXEL_SCALE, TILE_HEIGHT } from "../main";

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

        EM.hudLog.push(`Imp instructions: ${drawAt.x}, ${drawAt.y}, ${drawAt.w}, ${drawAt.h}`);
        //rectf(drawAt.x, drawAt.y, drawAt.w, drawAt.h);

        let lineHeight = frame.lineHeight;

        let txtOff = 6;
        pen(1);

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
}