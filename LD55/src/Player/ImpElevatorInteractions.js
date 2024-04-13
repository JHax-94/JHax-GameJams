import { ELEVATOR_INTERACT_STATE } from "../Enums/ElevatorInteractionState";
import { EM } from "../main";

export default class ImpElevatorInteractions
{
    constructor(imp)
    {
        this.interactionState = ELEVATOR_INTERACT_STATE.NONE;
        this.elevator = null;
        this.imp = imp;
    }

    Is(state)
    {
        return this.interactionState === state;
    }

    SetState(state)
    {
        this.interactionState = state;
    }

    SetElevator(elevator)
    {
        if(this.elevator !== elevator)
        {
            this.elevator = elevator;
            this.SetState(ELEVATOR_INTERACT_STATE.INTERACTABLE);
        }        
    }

    RemoveElevator(elevator)
    {
        if(this.elevator === elevator && this.interactionState !== ELEVATOR_INTERACT_STATE.ON_BOARD)
        {
            this.elevator = null;
            this.SetState(ELEVATOR_INTERACT_STATE.NONE);
        }
    }

    CanInteract()
    {
        return this.elevator != null;
    }

    Interact()
    {
        if(this.elevator)
        {   
            switch(this.interactionState)
            {
                case ELEVATOR_INTERACT_STATE.INTERACTABLE:
                    this.BoardElevator();
                    break;
                case ELEVATOR_INTERACT_STATE.ON_BOARD:
                    this.LeaveElevator();
                    break;
            }
        }
    }

    ElevatorControlsActive()
    {
        return this.Is(ELEVATOR_INTERACT_STATE.ON_BOARD);
    }

    BoardElevator()
    {
        this.SetState(ELEVATOR_INTERACT_STATE.ON_BOARD);
        this.imp.HideFromWorld()
    }

    LeaveElevator()
    {
        this.SetState(ELEVATOR_INTERACT_STATE.INTERACTABLE);

        let disembarkPos = this.elevator.GetDisembarkPosition();

        this.imp.RestoreToWorld(disembarkPos);
    }

    PipeInput(input)
    {
        if(this.elevator)
        {
            if(input.up)
            {
                this.elevator.MoveUp();
            }
            else if(input.down)
            {
                this.elevator.MoveDown();
            }
            else if(this.elevator.IsMoving())
            {
                this.elevator.Stop();
            }
        }
        else
        {
            console.error(`Interaction with null elevator...`);
        }
    }

    LogState()
    {
        let logString = "NULL";

        if(this.elevator)
        {
            switch(this.interactionState)
            {
                case ELEVATOR_INTERACT_STATE.NONE:
                    logString = "NONE";
                    break;
                case ELEVATOR_INTERACT_STATE.INTERACTABLE:
                    logString = "INTER";
                    break;
                case ELEVATOR_INTERACT_STATE.ON_BOARD:
                    logString = "ONBOARD";
                    break;
            }
        }

        EM.hudLog.push(`LIFT: ${logString}`);
    }
}