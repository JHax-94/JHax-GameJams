import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_WIDTH, consoleLog, p2 } from "../main";
import Shadow from "./Shadow";
import Whistle from "../PlayerActions/Whistle";

export default class Player
{
    constructor()
    {
        this.renderLayer = "CRITTERS";

        let physSettings = {
            tileTransform: {
                x: TILE_WIDTH / 2,
                y: TILE_WIDTH / 2,
                w: 1,
                h: 1
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

        this.texture = this.BuildTexture();

        this.shadow = new Shadow(this, { x: 0, y: 7 });
        this.whistle = new Whistle(this);

        this.inputLog = { 
            moveInput: [0, 0]
        };

        EM.RegisterEntity(this, { physSettings: physSettings });

        this.moveForce = 10000 * this.phys.mass;

        consoleLog("Player registered!");
        consoleLog(this);
    }

    BuildTexture()
    {
        let pTex = new Texture(PIXEL_SCALE, PIXEL_SCALE);

        pTex.sprite(0, 0, 0);
        return pTex;
    }


    Input(input)
    {
        this.LogMovementInput(input);
        this.LogActionInput(input);
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
        if(this.inputLog.action1 && this.whistle.CanActivate())
        {
            this.whistle.Activate();
        }
    }

    Update(deltaTime)
    {
        this.ApplyInputs(deltaTime);
        this.ApplyActions(deltaTime);

        this.whistle.Act(deltaTime);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        if(this.texture)
        {
            this.texture._drawEnhanced(screenPos.x, screenPos.y);
        }
        else
        {
            consoleLog(`=== WARNING PLAYER TEXTURE MISSING ===`);
        }

        //this.whistle.Draw();
    }
}

