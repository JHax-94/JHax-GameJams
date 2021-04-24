import { consoleLog, em, PIXEL_SCALE, LEFT, RIGHT, UP } from "./main";

export default class Diver
{
    constructor(pos, diver)
    {   
        this.spriteList = diver.spriteList;

        this.pos = pos;
        
        this.width = 0;
        this.height = 0;

        this.moveSpeed = { x: 1*PIXEL_SCALE, y: 0.2*PIXEL_SCALE };

        this.jumpSpeed = 2 * PIXEL_SCALE;
        this.canJump = false;        

        var phys = {

            tileTransform: { 
                x: 0, 
                y: 0, 
                w: 1, 
                h: 2
            },
            isSensor: false,
            isKinematic: false,
            mass: 10,
            tag: "DIVER",
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
        return { x: this.phys.position[0] - 0.5 * this.width, y: -(this.phys.position[1]-0.5*this.height) };
    }

    CanJump()
    {
        return this.canJump;
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

        if(inputs.key === UP && this.CanJump())
        {
            this.SetVelocity(this.moveSpeed.x, this.jumpSpeed);
            this.canJump = false;
        }
    }

    Update(deltaTime)
    {
        this.pos = em.GetPosition(this);
    }

    Draw()
    {
        for(var i = 0; i < this.spriteList.length; i ++)
        {
            sprite(this.spriteList[i].index, this.pos.x + this.spriteList[i].offset.x* PIXEL_SCALE , this.pos.y + this.spriteList[i].offset.y * PIXEL_SCALE, false, false, false);
        }

        /*
        if(em.drawColliders)
        {
            em.DrawColliders(this.phys);
        }*/
    }

}