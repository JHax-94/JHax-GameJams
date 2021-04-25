import InventoryItem from "./InventoryItem";
import { consoleLog, em, PIXEL_SCALE, LEFT, RIGHT, UP, DOWN, INTERACT, LoadChart, DATA_STORE, RED_KEY_SPRITE, PURPLE_KEY_SPRITE, GREEN_KEY_SPRITE } from "./main";

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
        
        this.jetMultiplier = 1;

        var storedKeys = DATA_STORE.GetKeys();

        this.hasJet = DATA_STORE.GetJetCount() > 0;

        var baseOffset = { x: 0.5, y: 0.5 };
        this.redKeyLabel = new InventoryItem({x: baseOffset.x, y: baseOffset.y }, RED_KEY_SPRITE, 0);
        this.purpleKeyLabel = new InventoryItem({x: baseOffset.x, y: baseOffset.y + 1 }, PURPLE_KEY_SPRITE, 0);
        this.greenKeyLabel = new InventoryItem({ x: baseOffset.x, y: baseOffset.y + 2}, GREEN_KEY_SPRITE, 0);

        
        this.redKeys = [];
        this.purpleKeys = [];
        this.greenKeys = [];
        for(var i = 0; i < storedKeys.length; i ++)
        {
            if(storedKeys[i].keyType === "RED")
            {
                this.redKeys.push(storedKeys[i]);
            }
            if(storedKeys[i].keyType === "PURPLE")
            {
                this.purpleKeys.push(storedKeys[i]);
            }
            if(storedKeys[i].keyType === "GREEN")
            {
                this.greenKeys.push(storedKeys[i]);
            }
        }

        this.SetLabelValue(this.redKeyLabel, this.redKeys.length);
        this.SetLabelValue(this.purpleKeyLabel, this.purpleKeys.length);
        this.SetLabelValue(this.greenKeyLabel, this.greenKeys.length);

        this.usedKeys = [];
        
        this.keys = [];
        this.pearls = [];
        this.maps = [];

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

    SetLabelValue(label, amount)
    {
        label.SetAmount(amount);
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

    AddKey(keyInfo)
    {
        this.keys.push(keyInfo);

        if(keyInfo.keyType === "RED")
        {
            this.redKeys.push(keyInfo);
            this.SetLabelValue(this.redKeyLabel, this.redKeys.length);
        }
        else if(keyInfo.keyType === "PURPLE")
        {
            this.purpleKeys.push(keyInfo);
            this.SetLabelValue(this.purpleKeyLabel, this.purpleKeys.length);
        }
        else if(keyInfo.keyType === "GREEN")
        {
            this.greenKeys.push(keyInfo);
            this.SetLabelValue(this.greenKeyLabel, this.greenKeys.length);
        }
    }

    AddJet()
    {
        this.hasJet = true;
    }

    UseKey(keyType)
    {
        var keyArray = [];
        var labelUpdate = null;
        if(keyType === "RED")
        {
            keyArray = this.redKeys;
            labelUpdate = this.redKeyLabel;
        }
        else if(keyType === "PURPLE")
        {
            keyArray = this.purpleKeys;
            labelUpdate = this.purpleKeyLabel;
        }
        else if(keyType === "GREEN")
        {
            keyArray = this.greenKeys;
            labelUpdate = this.greenKeyLabel;
        }

        var usedKey = null;
        if(keyArray.length > 0)
        {
            usedKey = keyArray[0];
            keyArray.pop();
        }
    
        if(usedKey)
        {
            this.usedKeys.push(usedKey);
        }
        
        if(labelUpdate)
        {
            this.SetLabelValue(labelUpdate, keyArray.length);
        }
    }

    Input(inputs)
    {
        //var velocity = this.GetVelocity();
        
        if(inputs.jet && this.hasJet)
        {
            this.jetMultiplier = 10;
        }
        else
        {
            this.jetMultiplier = 1;
        }

        if(inputs.right)
        {
            //consoleLog("MOVE RIGHT");
            //this.SetVelocity(this.moveSpeed.x, velocity.y);
            this.phys.applyForce([this.moveSpeed.x * this.jetMultiplier, 0])
        }
        else if(inputs.left)
        {
            //this.SetVelocity(-this.moveSpeed.x, velocity.y);
            this.phys.applyForce([-this.moveSpeed.x * this.jetMultiplier, 0]);
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
                this.phys.applyForce([0, this.moveSpeed.y * this.jetMultiplier]);
            }
            
        }
        else if(inputs.down)
        {
            //this.SetVelocity(velocity.x, -this.moveSpeed.y);

            this.phys.applyForce([0, -this.moveSpeed.y * this.jetMultiplier]);
        }

        if(inputs.interact && this.canInteract)
        {
            this.interactable.Interact(this);
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
        var depletion = this.oxygenMeter.depletionRate * this.jetMultiplier * deltaTime;

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