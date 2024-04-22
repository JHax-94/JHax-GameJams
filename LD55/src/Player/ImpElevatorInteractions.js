import { CONDEMNED_INPUT } from "../Enums/CondemnedInputs";
import { ELEVATOR_INTERACT_STATE } from "../Enums/ElevatorInteractionState";
import { EM, consoleLog, GAMEPAD_DEAD_ZONE } from "../main";

export default class ImpElevatorInteractions
{
    constructor(imp)
    {
        this.interactionState = ELEVATOR_INTERACT_STATE.NONE;
        this.elevator = null;
        this.imp = imp;

        this.inputs = {

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
        this.elevator.ImpOnBoard(this.imp);
        this.imp.HideFromWorld()
    }

    LeaveElevator(dir)
    {
        this.elevator.CloseAllDoors();
        this.elevator.Stop();
        this.inputs = {};

        let info = {
            dir: dir < 0 ? CONDEMNED_INPUT.MOVE_LEFT : CONDEMNED_INPUT.MOVE_RIGHT
        };

        let disembarkPos = this.elevator.GetDisembarkPosition(info);

        this.imp.RestoreToWorld(disembarkPos);

        this.elevator.ImpOnBoard(null);

        this.SetState(ELEVATOR_INTERACT_STATE.INTERACTABLE);
    }


    BtnFullPress(from, key, additionalCheck = null, saveAs = null)
    {
        let fullPressed = false;

        let addCheckPassed = (additionalCheck === null) || additionalCheck;

        let saveKey = saveAs ?? key;

        if(from[key] && !this.inputs[saveKey] && addCheckPassed)
        {
            this.inputs[saveKey] = true;
        }
        else if(!from[key] && this.inputs[saveKey])
        {
            this.inputs[saveKey] = false;
            fullPressed = true && addCheckPassed;
        }

        return fullPressed;

    }

    AxisCheck(axis, label, threshold)
    {
        let axisOverThreshold = false;

        if(!this.inputs[label] &&
            ( (threshold > 0 && axis > threshold) || (threshold < 0 && axis < threshold) ))
        {
            this.inputs[label] = true;
            axisOverThreshold = true;
        }        
        else if(Math.abs(axis) < GAMEPAD_DEAD_ZONE)
        {
            this.inputs[label] = false;
        }

        return axisOverThreshold;
    }

    PipeInput(input, padIn)
    {
        if(this.elevator)
        {
            if(input.up || padIn.y < -GAMEPAD_DEAD_ZONE || padIn.btn.up)
            {
                if(!this.elevator.DoorsClosed())
                {
                    this.elevator.CloseAllDoors();
                }
                this.elevator.MoveUp();
            }
            else if(input.down || padIn.y > GAMEPAD_DEAD_ZONE || padIn.btn.down)
            {
                if(!this.elevator.DoorsClosed())
                {
                    this.elevator.CloseAllDoors();
                }

                this.elevator.MoveDown();
            }
            else if(this.elevator.IsMoving())
            {
                this.elevator.Stop();
            }
            

            if(this.BtnFullPress(input, "right") || this.BtnFullPress(padIn.btn, "right", null, "dRight") || this.AxisCheck(padIn.x, "xPlus", 0.6))
            {
                this.elevator.ToggleRightDoor();
                /*this.input.right = false;*/
            }

            
            if(this.BtnFullPress(input, "left") || this.BtnFullPress(padIn.btn, "left", null, "dLeft") || this.AxisCheck(padIn.x, "xMinus", -0.6))
            {
                this.elevator.ToggleLeftDoor();
                /*this.input.left = false;*/
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