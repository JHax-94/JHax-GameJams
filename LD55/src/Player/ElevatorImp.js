import { ELEVATOR_INTERACT_STATE } from "../Enums/ElevatorInteractionState";
import TimeStepper from "../TimeStepper";
import { AUDIO, COLLISION_GROUP, EM, PIXEL_SCALE, consoleLog, GAMEPAD_DEAD_ZONE } from "../main";
import ImpElevatorInteractions from "./ImpElevatorInteractions";
import ImpInstructions from "./ImpInstructions";

let ANIM_STATES = 
{
    IDLE: 0,
    RUN: 1
};

export default class ElevatorImp
{
    constructor(tile, def)
    {
        this.srcTile = tile;

        this.renderLayer = "IMP";

        this.hideCollider = true;
        this.spriteIndex = def.index;

        let physSettings = {
            tileTransform: { x: tile.x, y: tile.y, w: 1, h: 1 },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: false,
            tag: "PLAYER",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.PLAYER,
            collisionMask: (COLLISION_GROUP.PLAYER | COLLISION_GROUP.ELEVATOR | COLLISION_GROUP.FLOOR),
            linearDrag: 0.99
        };

        this.runAnimations = [
            [ 15 ],
            [ 31, 47 ]
        ];

        this.lWingAnimation = [ 14, 30, 14, 46, 46, 46 ];
        this.rWingAnimation = [ 13, 29, 13, 45, 45, 45 ]; 

        this.wingAnimation = 0;

        this.animationState = ANIM_STATES.IDLE;
        this.animationFrame = 0;

        this.lastDir = -1;

        this.Setup();

        EM.RegisterEntity(this, { physSettings: physSettings })        
    }

    Setup()
    {
        this.speed = 4 * PIXEL_SCALE;
        this.jump = 5.5 * PIXEL_SCALE;
        this.jumpTimer = new TimeStepper(0.3, { onComplete: () => { this.jumpTimer.Reset(); } });

        this.runAnimTimer = new TimeStepper(0.2, { onComplete: () => { this.RunAnimationTick(); }});
        this.runAnimTimer.StartTimer();

        this.wingAnimationTimer = new TimeStepper(0.1, { onComplete: () => { this.WingAnimationTick(); }});

        this.elevator = new ImpElevatorInteractions(this);

        this.instructions = new ImpInstructions(this);

        this.inputs = {}
    }

    WingAnimationTick()
    {
        this.wingAnimation = (this.wingAnimation + 1) % this.lWingAnimation.length;

        if(this.wingAnimation !== 0)
        {
            this.wingAnimationTimer.Reset();
            this.wingAnimationTimer.StartTimer();
        }
    }

    RunAnimationTick()
    {
        this.animationFrame = (this.animationFrame + 1) % this.runAnimations[this.animationState].length;
        this.runAnimTimer.Reset();
        this.runAnimTimer.StartTimer();
    }

    SetElevator(elevator) { this.elevator.SetElevator(elevator); }
    RemoveElevator(elevator) { this.elevator.RemoveElevator(elevator); }

    HideFromWorld()
    {
        this.phys.gravityScale = 0;
        this.phys.velocity = [ 0, 0];
    }

    RestoreToWorld(position)
    {
        this.phys.position = position;
        this.phys.velocity = [0, 0];
        this.phys.gravityScale = 1;
    }

    BtnFullPress(from, key, additionalCheck = null)
    {
        let fullPressed = false;

        let addCheckPassed = (additionalCheck === null) || additionalCheck;

        if(from[key] && !this.inputs[key] && addCheckPassed)
        {
            this.inputs[key] = true;
        }
        else if(!from[key] && this.inputs[key])
        {
            this.inputs[key] = false;
            fullPressed = true && addCheckPassed;
        }

        return fullPressed;

    }

    Input(input)
    {
        let padIn = Object.assign({}, gamepad);
        
        for(let i = 0; i < 3; i ++ )
        {
            if(gamepads[i].available)
            {
                let pad = gamepads[i];

                if(Math.abs(pad.x) > GAMEPAD_DEAD_ZONE/* && Math.abs(pad.x) > Math.abs(padIn.x)*/)
                {
                    padIn.x = pad.x;
                }
                
                if(Math.abs(pad.y) > GAMEPAD_DEAD_ZONE/* && Math.abs(pad.y) > Math.abs(padIn.y)*/)
                {
                    padIn.y = pad.y;
                }
            }
        }

        EM.hudLog.push(`PadIN: (${padIn.x.toFixed(3)}, ${padIn.y.toFixed(3)}) A: ${padIn.btn.A} B: ${padIn.btn.B} X: ${padIn.btn.X}`);

        if(this.elevator.ElevatorControlsActive())
        {
            this.elevator.PipeInput(input, padIn);
            
        }
        else
        {
            if(input.left || padIn.x < -GAMEPAD_DEAD_ZONE)
            {
                this.animationState = ANIM_STATES.RUN;
                this.phys.velocity = [ -this.speed, this.phys.velocity[1] ];
            }
            else if(input.right || padIn.x > GAMEPAD_DEAD_ZONE)
            {
                this.animationState = ANIM_STATES.RUN;
                this.phys.velocity = [ this.speed, this.phys.velocity[1] ];
            }
            else 
            {
                this.animationState = ANIM_STATES.IDLE;
            }

            
            if(this.BtnFullPress(input, "up") || this.BtnFullPress(padIn.btn, "A"))
            {
                if(!this.jumpTimer.InProgress())
                {
                    AUDIO.PlayFx("flap");
                    this.phys.velocity = [ this.phys.velocity[0], this.jump ];
                    this.jumpTimer.StartTimer();
                    
                    this.WingAnimationTick();
                    this.wingAnimationTimer.StartTimer();
                }

                /*this.inputs.up = false;*/
            }
        }

        let canInteract = (this.elevator.CanInteract() || this.door)

        if(this.BtnFullPress(input, "interact", canInteract) || this.BtnFullPress(padIn.btn, "B", canInteract))
        {
            if(this.elevator.CanInteract())
            {
                this.elevator.Interact(1);
            }
            else if(this.door)
            {
                this.door.EnterDoor();
            }

            //this.inputs.interact = input.interact;
        }

        if(this.BtnFullPress(input, "interactLeft", canInteract) || this.BtnFullPress(padIn.btn, "X", canInteract))
        {
            if(this.elevator.CanInteract())
            {
                this.elevator.Interact(-1);
            }
            else if(this.door)
            {
                this.door.EnterDoor();
            }

            //this.inputs.interactLeft = input.interactLeft;
        }

        if(this.BtnFullPress(input, "esc") || this.BtnFullPress(padIn.btn, "start"))
        {
            this.inputs.esc = input.esc;
            EM.Pause();
        }
    }

    HasDoor()
    {
        return this.door && !this.door.hidden;
    }

    Update(deltaTime)
    {
        this.jumpTimer.TickBy(deltaTime);
        this.runAnimTimer.TickBy(deltaTime);
        this.wingAnimationTimer.TickBy(deltaTime);

        this.elevator.LogState();

        if(this.phys.velocity[0] > 0.1)
        {
            this.lastDir = 1;
        }
        else if(this.phys.velocity[0] < -0.1)
        {
            this.lastDir = -1;
        }

        let screenPos = this.GetScreenPos();
        
        if(screenPos.x < -PIXEL_SCALE || screenPos.y < -PIXEL_SCALE || screenPos.x > 16 * PIXEL_SCALE || screenPos.y > 16 * PIXEL_SCALE)
        {
            let tilePos = { x: this.srcTile.x, y: this.srcTile.y, w: 1, h: 1};
            let physPos = EM.TileToPhysPosition(tilePos);

            this.phys.position = physPos;
            this.phys.velocity = [ 0, 0 ];
            AUDIO.PlayFx("respawn");
        }

    }

    IsVisible()
    {
        return !this.elevator.Is(ELEVATOR_INTERACT_STATE.ON_BOARD);
    }

    Draw()
    {
        if(this.IsVisible())
        {
            let screenPos = this.GetScreenPos();

            let flipH = this.lastDir > 0;

            sprite(this.rWingAnimation[this.wingAnimation], screenPos.x + (this.lastDir * PIXEL_SCALE * 0.25), screenPos.y, flipH);
            sprite(this.lWingAnimation[this.wingAnimation], screenPos.x - (this.lastDir * PIXEL_SCALE * 0.5), screenPos.y, flipH);

            let anims = this.runAnimations[this.animationState];
            let frame = this.animationFrame % anims.length;

            let spriteIndex = anims[frame];

            sprite(spriteIndex, screenPos.x, screenPos.y, flipH);
        }
        else if(this.elevator.ElevatorControlsActive())
        {
            this.elevator.ShowDoorState();
        }

    }


}