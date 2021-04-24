import { consoleLog, em, PIXEL_SCALE, LEFT, RIGHT } from "./main";

export default class Diver
{
    constructor(pos, diver)
    {   
        this.spriteList = diver.spriteList;

        this.pos = pos;

        this.moveSpeed = { x: 5, y: 1 };

        
        var phys = {
            isSensor: false,
            isKinematic: false,
            mass: 10,
            tag: "DIVER"
        }

        em.AddPhys(this, phys);

        em.AddUpdate(this);
        em.AddRender(this);
        em.AddInput(this);

        this.SetVelocity(0, -1);
    }

    SetVelocity(x, y)
    {
        this.phys.velocity[0] = x;
        this.phys.velocity[1] = y;
    }

    GetVelocity()
    {
        return { x: this.phys.velocity[0], y: this.phys.velocity[1] };
    }

    GetScreenPos()
    {
        return { x: this.phys.position[0], y: -this.phys.position[1] };
    }

    Input(inputs)
    {
        var velocity = this.GetVelocity();

        if(inputs.key === RIGHT)
        {
            this.SetVelocity(this.moveSpeed.x, velocity.y);
        }
        else if(inputs.key === LEFT)
        {
            this.SetVelocity(-this.moveSpeed.x, velocity.y);
        }
    }

    Update(deltaTime)
    {
        this.pos = this.GetScreenPos();
    }

    Draw()
    {
        for(var i = 0; i < this.spriteList.length; i ++)
        {
            sprite(this.spriteList[i].index, this.pos.x + this.spriteList[i].offset.x* PIXEL_SCALE , this.pos.y + this.spriteList[i].offset.y * PIXEL_SCALE, false, false, false);
        }
    }

}