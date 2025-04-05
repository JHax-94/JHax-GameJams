import { splice } from "p2/src/utils/Utils";
import { EM, getFont, setFont } from "../main";

export default class ToastAlert
{
    constructor(message, pos, colour, manager)
    {

        this.manager = manager;
        this.slipInTime = 1;
        this.slipInY = 8;

        this.messageTime = 3;
        this.messageTimer = 0;

        this.font = getFont("LargeNarr");

        this.message = message;
        this.pos = pos;
        this.colour = colour;

        EM.RegisterEntity(this);
    }

    CurrentY()
    {
        return this.pos.y + this.slipInY * this.slipInTime;
    }

    ShiftY(newY, slipTime)
    {
        this.slipInY = (this.pos.y - newY) / slipTime;
        this.slipInTime = slipTime;
        this.pos.y = newY;
    }
    

    Update(deltaTime)
    {
        this.messageTimer += deltaTime;
        if(this.messageTimer > this.messageTime)
        {
            this.manager.RemoveMessage(this);
            EM.RemoveEntity(this);
        }

        if(this.slipInTime > 0)
        {
            this.slipInTime -= deltaTime;
        }

    }

    Draw()
    {
        setFont(this.font);

        pen(this.colour);
        print(this.message, this.pos.x, this.CurrentY());

        setFont("Default");
    }
}