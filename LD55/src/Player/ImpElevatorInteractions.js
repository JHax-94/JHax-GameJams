import { CONDEMNED_INPUT } from "../Enums/CondemnedInputs";
import { ELEVATOR_INTERACT_STATE } from "../Enums/ElevatorInteractionState";
import { EM, consoleLog } from "../main";

export default class ImpElevatorInteractions
{
    constructor(imp)
    {
        this.interactionState = ELEVATOR_INTERACT_STATE.NONE;
        this.elevator = null;
        this.imp = imp;

        this.input = {

        }
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

    GetBoardedElevator()
    {
        let elevator= null;
        if(this.Is(ELEVATOR_INTERACT_STATE.ON_BOARD))
        {
            elevator = this.elevator;
        }

        return elevator;
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

    Interact(dir)
    {
        if(this.elevator)
        {   
            switch(this.interactionState)
            {
                case ELEVATOR_INTERACT_STATE.INTERACTABLE:
                    this.BoardElevator();
                    break;
                case ELEVATOR_INTERACT_STATE.ON_BOARD:
                    this.LeaveElevator(dir);
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

    LeaveElevator(dir)
    {
        this.SetState(ELEVATOR_INTERACT_STATE.INTERACTABLE);

        this.elevator.CloseAllDoors();
        this.elevator.Stop();
        this.input = {};

        let info = {
            dir: dir < 0 ? CONDEMNED_INPUT.MOVE_LEFT : CONDEMNED_INPUT.MOVE_RIGHT
        };

        let disembarkPos = this.elevator.GetDisembarkPosition(info);

        this.imp.RestoreToWorld(disembarkPos);
    }

    PipeInput(input)
    {
        if(this.elevator)
        {
            if(this.elevator.DoorsClosed())
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

            if(input.right && !this.input.right)
            {
                this.input.right = true;
            }
            else if(!input.right && this.input.right)
            {
                this.elevator.ToggleRightDoor();
                this.input.right = false;
            }

            if(input.left && !this.input.left)
            {
                this.input.left = true;
            }
            else if(!input.left && this.input.left)
            {
                this.elevator.ToggleLeftDoor();
                this.input.left = false;
            }
        }
        else
        {
            console.error(`Interaction with null elevator...`);
        }
    }

    ShowDoorState()
    {
        /*
        let floorNum = this.elevator.GetCurrentFloorNumber();


        let distToFloor = this.elevator.GetDistanceToFloorLayer();

        let distStr = distToFloor;
        if(distToFloor !== NaN)
        {
            distStr = distToFloor.toFixed(3);
        }

        let stops = this.elevator.StopsAtCurrentLayer();

        let doorStateString = `F: ${floorNum}, L: ${this.elevator.leftDoorOpen ? "open" : "closed"}, R: ${this.elevator.rightDoorOpen ? "open" : "closed"}, P: ${this.elevator.passengers.length}, D: ${distStr}, S: ${stops}`;

        pen(1);
        print(doorStateString, [0, 0]);
        */
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

        //EM.hudLog.push(`LIFT: ${logString}`);
    }
}