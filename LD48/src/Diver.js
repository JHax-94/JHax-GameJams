import InventoryDisplay from "./InventoryDisplay";
import InventoryItem from "./InventoryItem";
import { consoleLog, em, PIXEL_SCALE, LEFT, RIGHT, UP, DOWN, INTERACT, LoadChart, DATA_STORE, RED_KEY_SPRITE, PURPLE_KEY_SPRITE, GREEN_KEY_SPRITE, OXYGEN_TOP_UP, TOP_UP_SPRITE } from "./main";

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

        this.animClock = 0;

        this.animations = [
            { 
                name:"left", 
                frameTime: 0.5,
                frames: [
                    [
                        { id: 0, sprite: 17, flipH: true },
                        { id: 1, sprite: 33, flipH: true }                    
                    ],
                    [
                        { id: 0, sprite: 17, flipH: true },
                        { id: 1, sprite: 49, flipH: true }
                    ]
                ]
            },
            { 
                name:"right", 
                frameTime: 0.5,
                frames: [
                    [
                        { id: 0, sprite: 17, flipH: false },
                        { id: 1, sprite: 33, flipH: false }                    
                    ],
                    [
                        { id: 0, sprite: 17, flipH: false },
                        { id: 1, sprite: 49, flipH: false }
                    ]
                ]
            },
            {
                name:"centre",
                frameTime: 0.5,
                frames: [
                    [
                        { id: 0, sprite: 16, flipH: false },
                        { id: 1, sprite: 32, flipH: false }                    
                    ],
                    [
                        { id: 0, sprite: 16, flipH: false },
                        { id: 1, sprite: 48, flipH: false }
                    ]
                ]
            }
        ];
        
        this.waitForTopUpLift = false;

        this.jetMultiplier = 1;

        var storedKeys = DATA_STORE.GetKeys();
        this.hasJet = DATA_STORE.GetJetCount() > 0;
        this.oxygenTopUps = DATA_STORE.GetOxygenTopUps();

        var baseOffset = { x: 0.5, y: 0.5 };

        this.topUpsLabel = new InventoryItem({x: baseOffset.x, y: baseOffset.y }, TOP_UP_SPRITE, this.oxygenTopUps);
        this.redKeyLabel = new InventoryItem({x: baseOffset.x, y: baseOffset.y + 1 }, RED_KEY_SPRITE, 0);
        this.purpleKeyLabel = new InventoryItem({x: baseOffset.x, y: baseOffset.y + 2 }, PURPLE_KEY_SPRITE, 0);
        this.greenKeyLabel = new InventoryItem({ x: baseOffset.x, y: baseOffset.y + 3}, GREEN_KEY_SPRITE, 0);

        this._bloopTime = 0.4;
        this.bloopTimer = 0;
        this.bloopSprite = 0;

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

        this.animationFrame = 0;

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

        //this.SetVelocity(0, -1);
        this.SetAnimation("centre");
    }

    SetAnimation(name)
    {
        if(!this.currentAnimation || this.currentAnimation.name !== name)
        {
            this.animationFrame = 0;
            this.animClock = 0;
            for(var i = 0; i < this.animations.length; i ++)
            {
                if(this.animations[i].name === name)
                {
                    this.currentAnimation = this.animations[i];
                    break;
                }
            }
        }
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

    AddOxygenTopUp()
    {
        this.oxygenTopUps ++;
        this.SetLabelValue(this.topUpsLabel, this.oxygenTopUps);
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

    HasKey(keyType)
    {
        var hasKey = false;
        if(keyType === "RED")
        {
            hasKey = this.redKeys.length > 0;
        }
        else if(keyType === "PURPLE")
        {
            hasKey = this.purpleKeys.length > 0;
        }
        else if(keyType === "GREEN")
        {
            hasKey = this.greenKeys.length > 0;
        }
    }

    AddJet()
    {
        this.hasJet = true;
    }

    Bloop(spriteIndex)
    {
        this.bloopSprite = spriteIndex;
        this.bloopTimer = this._bloopTime;
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
        
        var frameTime = 0;
        var isMoving = false;

        if(inputs.jet && this.hasJet)
        {
            this.jetMultiplier = 10;
            frameTime = 4;
        }
        else
        {
            this.jetMultiplier = 1;
            frameTime = 1;
        }

        if(this.waitForTopUpLift === false && inputs.topUp && this.oxygenTopUps > 0)
        {
            this.oxygenTopUps --;
            this.oxygenMeter.AddOxygen(OXYGEN_TOP_UP);
            this.SetLabelValue(this.topUpsLabel, this.oxygenTopUps);
            this.waitForTopUpLift = true;
        }
        else if(this.waitForTopUpLift === true && !inputs.topUp)
        {
            this.waitForTopUpLift = false;
        }

        if(inputs.right)
        {
            //consoleLog("MOVE RIGHT");
            //this.SetVelocity(this.moveSpeed.x, velocity.y);
            this.phys.applyForce([this.moveSpeed.x * this.jetMultiplier, 0]);
            isMoving = true;
            this.SetAnimation("right");
        }
        else if(inputs.left)
        {
            //this.SetVelocity(-this.moveSpeed.x, velocity.y);
            this.phys.applyForce([-this.moveSpeed.x * this.jetMultiplier, 0]);
            isMoving = true;
            this.SetAnimation("left");
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
                if(!isMoving)
                {
                    this.SetAnimation("centre");
                }
                isMoving = true;
                this.phys.applyForce([0, this.moveSpeed.y * this.jetMultiplier]);
            }
            
        }
        else if(inputs.down)
        {
            //this.SetVelocity(velocity.x, -this.moveSpeed.y);
            if(!isMoving)
            {
                this.SetAnimation("centre");
            }

            this.phys.applyForce([0, -this.moveSpeed.y * this.jetMultiplier]);
            isMoving = true;
        }

        if(inputs.interact && this.canInteract)
        {
            this.interactable.Interact(this);
            this.SetInteractable(null);
        }

        this.frameMultiplier = isMoving ? frameTime : 0;
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
        /*
        if(velocity.x < -animSwitchThreshold)
        {
            this.SetAnimation("left");
        }
        else if(velocity.x > animSwitchThreshold)
        {
            this.SetAnimation("right")
        }
        else 
        {
            this.SetAnimation("centre");
        }*/

        this.animClock += deltaTime * this.frameMultiplier;

        if(this.animClock > this.currentAnimation.frameTime)
        {
            this.animClock = 0;
            this.animationFrame = (this.animationFrame + 1) % this.currentAnimation.frames.length;
        }

        var cameraDiff = Math.abs(this.pos.y - em.halfScreen);

        var cameraMultiplier = Math.ceil(cameraDiff / 5);

        if(velocity.y < 0 && this.pos.y > em.halfScreen)
        {
            em.MoveCamera(-1 * cameraMultiplier);
        }
        else if(velocity.y > 0 && this.pos.y < em.halfScreen)
        {
            em.MoveCamera(1 * cameraMultiplier);
        }

        if(this.bloopTimer > 0)
        {
            this.bloopTimer -= deltaTime;
            if(this.bloopTimer <= 0 )
            {
                this.bloopTimer = 0;
            }
        }

        //consoleLog(this.pos);
        var depletion = this.oxygenMeter.depletionRate * this.jetMultiplier * deltaTime;

        this.AddOxygen(-depletion);
    }

    Draw()
    {
        for(var i = 0; i < this.spriteList.length; i ++)
        {
            /*
            consoleLog(this.currentAnimation);
            consoleLog(this.animationFrame);*/
            var frame = this.currentAnimation.frames[this.animationFrame][i];
            //consoleLog(frame);
            sprite(frame.sprite, this.pos.x + this.spriteList[i].offset.x* PIXEL_SCALE , this.pos.y + this.spriteList[i].offset.y * PIXEL_SCALE, frame.flipH);
        }

        if(this.canInteract && this.bloopTimer <= 0)
        {
            sprite(this.interactPromptSpriteIndex, this.pos.x, this.pos.y - PIXEL_SCALE);
        }
        else if(this.bloopTimer > 0)
        {
            sprite(this.bloopSprite, this.pos.x, (this.pos.y - PIXEL_SCALE) + (this.bloopTimer / this._bloopTime) * PIXEL_SCALE);
        }
    }

}