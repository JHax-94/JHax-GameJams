import Action from "./Characters/Action";
import MoveAction from "./Characters/MoveAction";
import TurnAction from "./Characters/TurnAction";
import { consoleLog, EM, TURN_PHASES, TURN_PHASE_NAME } from "./main";



export default class FlowManager
{
    constructor()
    {

        this.inputGroup = "DEFAULT";
        this.inputWaits = {
            up: false,
            left: false,
            right: false,
            down: false,
            action1: false,
            action2: false,
            action3: false,
            execute: false
        }

        this.turnPhase = TURN_PHASES.PLAYER_1_INPUT

        EM.RegisterEntity(this);

        this.players = [];

        /*        
        consoleLog("Player List:");
        consoleLog(this.players);
        consoleLog(EM);*/
    }

    GrabObjects()
    {
        this.players.push(EM.GetEntity("Player1"));
        this.players.push(EM.GetEntity("Player2"));
    }

    IsPlayerInputPhase()
    {
        return this.turnPhase === TURN_PHASES.PLAYER_1_INPUT || this.turnPhase === TURN_PHASES.PLAYER_2_INPUT;
    }

    Input(inputState)
    {
        this.CheckInput(inputState.btn.up, "up", null, () => {
            if(this.IsPlayerInputPhase())
            {
                this.QueueAction(new MoveAction());
            }
        });
        
        this.CheckInput(inputState.btn.left, "left", null, () => {
            if(this.IsPlayerInputPhase())
            {
                this.QueueAction(new TurnAction(-1));
            }
        });

        this.CheckInput(inputState.btn.right, "right", null, () => {
            if(this.IsPlayerInputPhase())
            {
                this.QueueAction(new TurnAction(1));
            }
        });
        
        this.CheckInput(inputState.btn.down, "down", null, () => {
            if(this.IsPlayerInputPhase())
            {
                this.PopActionQueue();
            }
        });

        this.CheckInput(inputState.btn.execute, "execute", null, () => {
            if(this.IsPlayerInputPhase())
            {
                this.ExecutePlayerActions();
            }
        })
    }

    GetActivePlayer()
    {
        if(this.turnPhase === TURN_PHASES.PLAYER_1_INPUT)
        {
            return this.players[0];
        }
        else if(this.turnPhase === TURN_PHASES.PLAYER_2_INPUT)
        {
            return this.players[1];
        }
        else 
        {
            return null;
        }
    }

    ExecutePlayerActions()
    {
        let player = this.GetActivePlayer();

        player.ExecuteActionQueue();
        this.turnPhase = TURN_PHASES.ACTION;
    }

    PopActionQueue()
    {
        player.PopActionQueue();
    }

    QueueAction(action)
    {
        let player = this.GetActivePlayer();
        consoleLog(`Active player:`);
        consoleLog(player);

        player.AddToActionQueue(action);
    }

    CheckInput(btnState, wait, holdAction, releaseAction)
    {
        ///consoleLog(`State: ${btnState}, Wait: ${this.inputWaits[wait]}`);

        let fullClick = true;

        if(btnState && !this.inputWaits[wait])
        {
            this.inputWaits[wait] = true;
            if(holdAction)
            {
                holdAction();
            }
        }
        else if(!btnState && this.inputWaits[wait])
        {
            this.inputWaits[wait] = false;
            if(releaseAction)
            {
                releaseAction();
            }
            fullClick = true;
        }

        return fullClick;
    }


    Update(deltaTime)
    {
        EM.hudLog.push(`Phase: ${TURN_PHASE_NAME(this.turnPhase)}`)

        let activePlayer = this.GetActivePlayer();

        if(activePlayer)
        {
            for(let i = 0; i < activePlayer.actionQueue.length; i ++)
            {
                EM.hudLog.push(activePlayer.actionQueue[i].name);
            }
        }
    }
}