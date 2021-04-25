import { consoleLog, em, PIXEL_SCALE, LEFT, RIGHT, UP, DOWN, INTERACT, LoadChart } from "./main";

export default class Diver
{
    constructor(pos, diver, oxygenMeter)
    {   
        consoleLog("CONSTRUCTING DIVER");

        if(oxygenMeter)
        {
            this.oxygenMeter = oxygenMeter;
            /*
            this.oxygenMax = 100;
            this.oxygenDepletion = 1;
            this.oxygen = this.oxygenMax;

            this.oxygenMeter.SetFilled(this.oxygen, this.oxygenMax);*/
        }
        
        this.spriteList = diver.spriteList;

        this.interactPromptSpriteIndex = 25;

        this.pos = pos;
        
        this.width = 0;
        this.height = 0;

        this.canInteract = false;
        this.interactable = null;

        this.moveSpeed = { x: 10*PIXEL_SCALE, y: 10*PIXEL_SCALE };

        this.jumpSpeed = 25 * PIXEL_SCALE;
        this.canJump = false;        

        var phys = {

            tileTransform: { 
                x: this.pos.x, 
                y: this.pos.y, 
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
            consoleLog("Collecting: ");
            consoleLog(collectable);

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

    AddMaxOxygen(increaseAmount)
    {
        this.oxygenMeter.UpgradeOxygen();
    }

    Input(inputs)
    {
        //var velocity = this.GetVelocity();

        if(inputs.right)
        {
            //consoleLog("MOVE RIGHT");
            //this.SetVelocity(this.moveSpeed.x, velocity.y);
            this.phys.applyForce([this.moveSpeed.x, 0])
        }
        else if(inputs.left)
        {
            //this.SetVelocity(-this.moveSpeed.x, velocity.y);
            this.phys.applyForce([-this.moveSpeed.x, 0]);
        }

        if(inputs.up)
        {
            //this.SetVelocity(this.moveSpeed.x, this.jumpSpeed);

            if(this.CanJump())
            {
                consoleLog("Jump!");
                this.phys.applyImpulse([0, this.jumpSpeed]);
                this.canJump = false;
            }
            else
            {
                this.phys.applyForce([0, this.moveSpeed.y]);
            }
            
        }
        else if(inputs.down)
        {
            //this.SetVelocity(velocity.x, -this.moveSpeed.y);

            this.phys.applyForce([0, -this.moveSpeed.y]);
        }

        if(inputs.interact && this.canInteract)
        {
            this.interactable.Interact();
            this.SetInteractable(null);
        }
    }

    SetInteractable(setInteractable)
    {
        if(setInteractable)
        {
            consoleLog("Set ineractable");
            consoleLog(setInteractable);
            if(setInteractable.CanInteract())
            {
                this.interactable = setInteractable;
                this.canInteract = true;
            }
        }
        else 
        {
            this.interactable = null;
            this.canInteract = false;
        }
        
    }
    /*
    UpdateOxygenMeter()
    {
        if(this.oxygenMeter)
        {
            this.oxygenMeter.SetFilled(this.oxygen, this.oxygenMax);
        }
    }*/

    AddOxygen(amount)
    {
        this.oxygenMeter.AddOxygen(amount);
    }


    Update(deltaTime)
    {
        /*
        consoleLog("GET DIVER POS");
        consoleLog(this.phys.position);
        */
        this.pos = em.GetPosition(this);
        
        var velocity = this.GetVelocity();
        /*
        consoleLog("Move camera?");
        consoleLog(velocity);
        consoleLog(this.pos);
        consoleLog(em.halfScreen);*/

        if(velocity.y < 0 && this.pos.y > em.halfScreen)
        {
            em.MoveCamera(-1);
        }
        else if(velocity.y > 0 && this.pos.y < em.halfScreen)
        {
            em.MoveCamera(1);
        }

        //consoleLog(this.pos);
        var depletion = this.oxygenMeter.depletionRate * deltaTime;

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