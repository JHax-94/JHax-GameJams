import { ELEVATOR_INTERACT_STATE } from "../Enums/ElevatorInteractionState";
import { COLLISION_GROUP, EM, PIXEL_SCALE, consoleLog } from "../main";
import ImpElevatorInteractions from "./ImpElevatorInteractions";

export default class ElevatorImp
{
    constructor(tile, def)
    {
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

        this.Setup();

        EM.RegisterEntity(this, { physSettings: physSettings })        
    }

    Setup()
    {
        this.speed = 60;

        this.elevator = new ImpElevatorInteractions(this);

        this.inputs = {}
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
        this.phys.gravityScale = 1;
    }

    Input(input)
    {
        

        if(this.elevator.ElevatorControlsActive())
        {
            this.elevator.PipeInput(input);
        }
        else
        {
            if(input.left)
            {
                this.phys.velocity = [ -this.speed, this.phys.velocity[1] ];
            }
            else if(input.right)
            {
                this.phys.velocity = [ this.speed, this.phys.velocity[1] ];
            }
        }

        if(input.interact && !this.inputs.interact)
        {
            if(this.elevator.CanInteract())
            {
                this.inputs.interact = input.interact;
            }
        }
        else if(!input.interact && this.inputs.interact)
        {
            if(this.elevator.CanInteract())
            {
                this.elevator.Interact();
            }

            this.inputs.interact = input.interact;
        }
    }

    Update(deltaTime)
    {
        this.elevator.LogState();
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

            sprite(this.spriteIndex, screenPos.x, screenPos.y);
        }
    }


}