import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, SETUP, TILE_WIDTH, consoleLog, formatToFixed, getObjectConfig, p2, playFx } from "../main";
import Shadow from "./Shadow";
import Whistle from "../PlayerActions/Whistle";
import PlayerInventory from "./PlayerInventory";
import Bait from "../PlayerActions/Bait";
import Horn from "../PlayerActions/Horn";
import Block from "../Block";

export default class Player
{
    constructor(startPos, startItems)
    {
        this.renderLayer = "CRITTERS";

        let physSettings = {
            tileTransform: {
                x: startPos.x,
                y: startPos.y,
                w: 0.5,
                h: 0.5
            },
            mass: 50,
            isSensor: false,
            isKinematic: false,
            tag: "PLAYER",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.PLAYER,
            collisionMask: COLLISION_GROUP.PLAYER,
            linearDrag: 0.9
        };

        this.walkAngle = 0;
        this.walkTime = 0;

        this.passthrough = [];

        this.texture = this.BuildTexture();

        this.shadow = new Shadow(this, { x: 0, y: 5 });
        //this.whistle = new Whistle(this);

        this.elapsedTime = 0;

        this.inputLog = { 
            moveInput: [0, 0]
        };

        

        this.inventory = [];

        this.AddItems(startItems);
        this.inventoryUi = new PlayerInventory(this);

        consoleLog("---REGISTER PLAYER ENTITY:---");
        EM.RegisterEntity(this, { physSettings: physSettings });
        

        this.moveForce = 10000 * this.phys.mass;

        this.pickupOverlaps = [];

        consoleLog("---Player registered!---");
        consoleLog(this);

        this.promptTex = this.BuildPromptTex();
    }

    BuildPromptTex()
    {
        let newTex = new Texture( PIXEL_SCALE, PIXEL_SCALE + 1);

        newTex.paper(6);
        newTex.rectf(0, 1, PIXEL_SCALE*0.5, PIXEL_SCALE*0.5);

        newTex.paper(4);
        newTex.rectf(0, 0, PIXEL_SCALE*0.5, PIXEL_SCALE*0.5);

        newTex.print("E", 2, 2);

        return newTex;
    }

    FollowTarget()
    {
        return this;
    }

    PickupOverlaps()
    {
        for(let i = 0; i <this.pickupOverlaps.length; i ++)
        {
            let pu = this.pickupOverlaps[i];

            consoleLog("Pick up item:");
            consoleLog(pu);
            let itemName = pu.GetItemName();

            this.AddItem({
                object: itemName,
                quantity: 1,
            }, true);

            pu.DeleteBeast();
        }
    }

    AddPickupOverlap(overlap)
    {
        if(this.pickupOverlaps.indexOf(overlap) < 0)
        {
            this.pickupOverlaps.push(overlap);
        }
    }

    RemovePickupOverlap(overlap)
    {
        let index = this.pickupOverlaps.indexOf(overlap);

        consoleLog(`Remove overlap: ${index}`);
        consoleLog(overlap);
        consoleLog(this.pickupOverlaps);

        if(index >= 0)
        {
            this.pickupOverlaps.splice(index, 1);
        }
    }

    HasItem(name, amount)
    {
        let hasItem = false;

        let item = this.inventory.find(inv => inv.object === name);

        if(item)
        {
            if(item.quantity >= amount)
            {
                hasItem = true;
            }            
        }

        return hasItem;
    }

    BuildTexture()
    {
        let pTex = new Texture(PIXEL_SCALE, PIXEL_SCALE);

        pTex.sprite(0, 0, 0);
        return pTex;
    }

    AddItem(srcItem, updateUi)
    {
        consoleLog("Adding Item:");
        consoleLog(srcItem);

        let copyItem = Object.assign({}, srcItem);

        if(copyItem.object === "Whistle")
        {  
            this.whistle = new Whistle(this);

            copyItem.quantity = null;
        }

        if(copyItem.object === "Horn")
        {
            this.horn = new Horn(this);

            copyItem.quantity = null;
        }

        let item = this.inventory.find(inv => inv.object === copyItem.object);

        if(item)
        {
            item.quantity += copyItem.quantity;
        }
        else
        {
            this.inventory.push(copyItem);
        }

        if(updateUi)
        {
            this.inventoryUi.UpdateUi();
        }
    }

    AddItems(itemList)
    {
        for(let i = 0; i < itemList.length; i ++)
        {
            this.AddItem(itemList[i]);
        }

        if(this.inventoryUi)
        {
            this.inventoryUi.UpdateUi();
        }
    }


    Input(input)
    {
        this.LogMovementInput(input);
        this.LogActionInput(input);

        if(input.escTriggered)
        {
            EM.Pause();
        }
    }

    LogMovementInput(input)
    {
        let x = input.right - input.left;
        let y = input.up - input.down;
        
        if(x != 0 || y != 0)
        {
            let moveVec = [x, y];
            let norm = [];
            p2.vec2.normalize(norm, moveVec);
            this.inputLog.moveInput[0] = norm[0];
            this.inputLog.moveInput[1] = norm[1];
        }
        else
        {
            this.inputLog.moveInput[0] = 0;
            this.inputLog.moveInput[1] = 0;
        }
    }

    LogActionInput(input)
    {
        this.inputLog.action1Triggered = input.action1Triggered;
        this.inputLog.action1 = input.action1;

        this.inputLog.action2Triggered = input.action2Triggered;
        this.inputLog.action2 = input.action2;

        this.inputLog.action3Triggered = input.action3Triggered;
        this.inputLog.action3 = input.action3;

        this.inputLog.action4Triggered = input.action4Triggered;
        this.inputLog.action4 = input.action4;
        
        this.inputLog.action5Triggered = input.action5Triggered;
        this.inputLog.action5 = input.action5;

        this.inputLog.eTriggered = input.eTriggered;
        this.inputLog.e = input.e;
    }   

    MoveForce()
    {
        return this.moveForce;
    }

    HasMoveInput()
    {
        return this.inputLog.moveInput[0] !== 0 || this.inputLog.moveInput[1] !== 0;
    }

    ApplyInputs(deltaTime)
    {
        let moveForce = [];

        if(this.HasMoveInput())
        {
            p2.vec2.scale(moveForce, this.inputLog.moveInput, this.MoveForce() * deltaTime);
            this.phys.applyForce(moveForce);
        }
        else
        {
            this.phys.setZeroForce();
            this.phys.velocity = [0, 0];
        }
        
    }

    ApplyActions(deltaTime)
    {
        if(this.whistle)
        {
            if(this.inputLog.action1 && this.whistle.CanActivate())
            {
                this.whistle.Activate();
            }
        }

        if(this.horn)
        {
            if(this.inputLog.action2 && this.horn.CanActivate())
            {
                this.horn.Activate();
            }
        }

        let screenPos = this.GetScreenPos();
        let spawnPos = {x: screenPos.x / PIXEL_SCALE, y: screenPos.y / PIXEL_SCALE };

        if(this.inputLog.action3Triggered)
        {
            if(this.HasItem("BaitMeat", 1))
            {
                let baitConf = getObjectConfig("BaitMeat", true);
                let screenPos = this.GetScreenPos();
                new Bait(spawnPos, baitConf);

                this.AddItem({ object: "BaitMeat", quantity: -1 }, true);
            }
        }

        if(this.inputLog.action4Triggered)
        {
            if(this.HasItem("BaitBerry", 1))
            {
                let baitConf = getObjectConfig("BaitBerry", true);
                
                new Bait(spawnPos, baitConf);

                this.AddItem({ object: "BaitBerry", quantity: -1 }, true);
            }
        }

        if(this.inputLog.action5Triggered)
        {
            if(this.HasItem("Block", 1))
            {
                let block = new Block(spawnPos);

                playFx("block");

                this.passthrough.push(block.phys);

                this.AddItem({ object: "Block", quantity: -1}, true);
            }
        }

        if(this.inputLog.eTriggered)
        {
            this.PickupOverlaps();
        }
    }

    HasPassthrough(body)
    {
        return this.passthrough.indexOf(body) >= 0;
    }

    RemovePassthrough(body)
    {
        let index = this.passthrough.indexOf(body);

        if(index >= 0)
        {
            this.passthrough.splice(index, 1);
        }
    }

    Update(deltaTime)
    {
        this.ApplyInputs(deltaTime);
        this.ApplyActions(deltaTime);

        if(this.whistle)
        {
            this.whistle.Act(deltaTime);
        }
        if(this.horn)
        {
            this.horn.Act(deltaTime);
        }

        this.elapsedTime += deltaTime;

        let moveSpeed = p2.vec2.sqrLen(this.phys.velocity);

        this.walkAngle = 1 - Math.sin((this.elapsedTime % (Math.PI * 2)));
        /*
        if(moveSpeed > 0.1)
        {
            this.walkTime += deltaTime;
            consoleLog(`Move speed: ${moveSpeed}`);

            this.walkAngle = Math.sin((this.elapsedTime % (Math.PI * 2)) * moveSpeed / 750);
        }
        else if(this.walkAngle > 0)
        {
            this.walkTime = 0;
            this.walkAngle -= deltaTime;
            if(this.walkAngle < 0)
            {
                this.walkAngle = 0;
            }
        }
        else if(this.walkAngle < 0)
        {
            this.walkTime = 0;
            this.walkAngle += deltaTime;
            if(this.walkAngle > 0)
            {
                this.walkAngle = 0;
            }
        }*/
    }

    Draw()
    {
        EM.hudLog.push(`Walk angle: ${formatToFixed(this.walkAngle, 3)}`);
        let screenPos = this.GetScreenPos();

        if(this.texture)
        {
            this.texture._drawEnhanced(screenPos.x, screenPos.y, { angle: this.walkAngle * (Math.PI / 4)  });
        }
        else
        {
            consoleLog(`=== WARNING PLAYER TEXTURE MISSING ===`);
        }

        if(this.pickupOverlaps.length > 0)
        {
            this.promptTex._drawEnhanced(screenPos.x + PIXEL_SCALE, screenPos.y - 2 * PIXEL_SCALE, {scale: 2 });
        }

        //this.whistle.Draw();
    }
}

