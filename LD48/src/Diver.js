import { consoleLog, em, PIXEL_SCALE, LEFT, RIGHT, UP, INTERACT } from "./main";

export default class Diver
{
    constructor(pos, diver, oxygenMeter)
    {   
        if(oxygenMeter)
        {
            this.oxygenMeter = oxygenMeter;
            this.oxygenMax = 100;
            this.oxygenDepletion = 1;
            this.oxygen = this.oxygenMax;

            this.oxygenMeter.SetFilled(this.oxygen, this.oxygenMax);
        }
        
        this.spriteList = diver.spriteList;

        this.interactPromptSpriteIndex = 10;

        this.pos = pos;
        
        this.width = 0;
        this.height = 0;

        this.canInteract = false;
        this.interactable = null;

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

    Collect(collectable)
    {
        if(collectable)
        {
            collectable.CollectedBy(this);
        }
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

        if(inputs.key === INTERACT && this.canInteract)
        {
            this.interactable.Interact();
        }
    }

    SetInteractable(setInteractable)
    {
        if(setInteractable)
        {
            this.interactable = setInteractable;
            this.canInteract = true;
        }
        else 
        {
            this.interactable = null;
            this.canInteract = false;
        }
        
    }
    
    AddOxygen(amount)
    {
        this.oxygen += amount;

        if(this.oxygen >= this.oxygenMax)
        {
            this.oxygen = this.oxygenMax;            
        }
        
        if(this.oxygen <= 0)
        {
            this.oxygen = 0;
        }

        if(this.oxygenMeter)
        {
            this.oxygenMeter.SetFilled(this.oxygen, this.oxygenMax);
        }
    }


    Update(deltaTime)
    {
        this.pos = em.GetPosition(this);
        var depletion = this.oxygenDepletion * deltaTime;

        this.AddOxygen(-depletion);
    }

    Draw()
    {
        for(var i = 0; i < this.spriteList.length; i ++)
        {
            sprite(this.spriteList[i].index, this.pos.x + this.spriteList[i].offset.x* PIXEL_SCALE , this.pos.y + this.spriteList[i].offset.y * PIXEL_SCALE);
        }

        if(this.canInteract)
        {
            sprite(this.interactPromptSpriteIndex, this.pos.x, this.pos.y - PIXEL_SCALE);
        }

        /*
        if(em.drawColliders)
        {
            em.DrawColliders(this.phys);
        }*/
    }

}