import BasicAi from "./AI/BasicAi";
import RandomAi from "./AI/RandomAi";
import Action from "./Characters/Action";
import BasicAttackAction from "./Characters/BasicAttackAction";
import ChangeStance from "./Characters/ChangeStance";
import MoveAction from "./Characters/MoveAction";
import TurnAction from "./Characters/TurnAction";
import ControlsDisplay from "./ControlsDisplay";
import { consoleLog, DATA, EM, getObjectConfig, SETUP, TURN_PHASES, TURN_PHASE_NAME } from "./main";
import PopUp from "./Ui/PopUp";
import EdgeDeteriorator from "./World/EdgeDeteriorator";
import MapDeteriorator from "./World/MapDeteriorator";
import NoneDeteriorator from "./World/NoneDeteriorator";
import RandomDeteriorator from "./World/RandomDeteriorator";
import RandomEdgeDeteriorator from "./World/RandomEdgeDeteriorator";



export default class FlowManager
{
    constructor(levelConfig)
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
            execute: false,
            space: false
        };

        this.turnPhase = TURN_PHASES.PLAYER_1_INPUT

        EM.RegisterEntity(this);

        this.players = [];

        this.playerWaits = [];

        this.arena = null;

        this.popDelay = 0.1;
        this.popDelayTimer = 0;

        this.endRoundConfig = getObjectConfig("EndRoundPopUp");
        this.clockHelpConfig = getObjectConfig("ClockHelp");
        this.pauseConfig = getObjectConfig("PauseMenu");

        this.pauseMenu = null;

        this.ai = null;

        consoleLog("Level config:");
        consoleLog(levelConfig);

        if(levelConfig.ai)
        {
            if(levelConfig.ai === "Simple")
            {
                this.ai = new RandomAi();
            }
            else if(levelConfig.ai === "Basic")
            {
                this.ai = new BasicAi();
            }
        }

        this.deteriorator = null;

        if(levelConfig.mapDeteriorate)
        {
            if(levelConfig.mapDeteriorate === "Edge")
            {
                this.deteriorator = new EdgeDeteriorator();
            }
            else if(levelConfig.mapDeteriorate === "None")
            {
                this.deteriorator = new NoneDeteriorator();
            }
            else if(levelConfig.mapDeteriorate === "FullRandom")
            {
                this.deteriorator = new RandomDeteriorator();
            }
            else if(levelConfig.mapDeteriorate === "RandomEdge")
            {
                this.deteriorator = new RandomEdgeDeteriorator();
            }
        }

        this.pausedPhase = 0;

        /*        
        consoleLog("Player List:");
        consoleLog(this.players);
        consoleLog(EM);*/
    }

    GrabObjects()
    {
        let player1 = EM.GetEntity("Player1");
        let player2 = EM.GetEntity("Player2");

        this.players.push(player1);
        this.players.push(player2);

        if(this.ai)
        {
            player2.SetAi(this.ai);
        }

        this.arena = EM.GetEntity("ARENA");
    }

    IsPlayerInputPhase()
    {
        return this.turnPhase === TURN_PHASES.PLAYER_1_INPUT || this.turnPhase === TURN_PHASES.PLAYER_2_INPUT;
    }

    Input(inputState)
    {
        if(this.IsPlayerInputPhase())
        {
            this.CheckInput(inputState.btn.up, "up", null, () => {
                this.QueueAction(new MoveAction());
            });
            
            this.CheckInput(inputState.btn.left, "left", null, () => {
                this.QueueAction(new TurnAction(-1));
            });

            this.CheckInput(inputState.btn.right, "right", null, () => {
                this.QueueAction(new TurnAction(1));                
            });

            this.CheckInput(inputState.btn.action1, "action1", null, () => {
                this.QueueAction(new BasicAttackAction());
            });

            this.CheckInput(inputState.btn.action2, "action2", null, () => {
                this.QueueAction(new ChangeStance(1));                
            });

            this.CheckInput(inputState.btn.action3, "action3", null, () => {
                this.QueueAction(new ChangeStance(-1));
            });

            this.CheckInput(inputState.btn.down, "down", null, () => {
                this.PopActionQueue();
            });

            this.CheckInput(inputState.btn.execute, "execute", null, () => {
                this.ExecutePlayerActions();
            });

            this.CheckInput(inputState.btn.space, "space", () => { this.ShowPlayerMoves(); }, () => { this.HidePlayerMoves(); });
        }

        /*
        if(this.turnPhase === TURN_PHASES.MENU)
        {
            this.CheckInput(inputState.btn.action1, "action1", null, () => {
                this.ResetPlayers();
            });

            this.CheckInput(inputState.btn.action3, "action3", null, () => {
                this.LoadMainMenu();
            });
        }*/

        if(this.turnPhase !== TURN_PHASES.PAUSE)
        {
            this.CheckInput(inputState.btn.esc, "esc", null, () => {
                this.ShowPauseMenu();
            });
        }
    }

    Resume()
    {
        consoleLog("RESUME!");
        EM.pause = false;
        this.turnPhase = this.pausedPhase;
        this.pauseMenu.Close();
        this.pauseMenu = null;
    }

    ShowPauseMenu()
    {
        EM.pause = true;

        this.pausedPhase = this.turnPhase;
        this.turnPhase = TURN_PHASES.PAUSE;

        let flow = this;

        this.pauseMenu = new PopUp(this.pauseConfig.components,{
            resumeEvt: () => flow.Resume(),
            quitEvt: () => flow.LoadMainMenu()
        });
    }

    LoadMainMenu()
    {
        SETUP("Menu");
    }

    ResetPlayers()
    {
        if(this.endRoundScreen)
        {
            this.endRoundScreen.Close();
            this.endRoundScreen = null;
            this.popDelayTimer = 0.0;
        }

        this.arena.ReloadMap();

        for(let i = 0; i < this.players.length; i ++)
        {
            this.players[i].Reset();
        }

        this.StartNewInputPhase(false);
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

    ShowPlayerMoves()
    {
        let active = this.GetActivePlayer();
        
        this.clockHelp = new PopUp(this.clockHelpConfig.components, {});

        active.actionUi.Show();
    }

    HidePlayerMoves()
    {
        let active = this.GetActivePlayer();

        this.clockHelp.Close();

        active.actionUi.Hide();
    }

    StartActionPhase()
    {
        this.turnPhase = TURN_PHASES.ACTION;

        this.playerWaits = [];

        for(let i = 0; i < this.players.length; i ++)
        {
            this.players[i].ExecuteActionQueue();
            this.playerWaits.push(true);
        }
    }

    ExecutePlayerActions()
    {
        let activePlayer = this.GetActivePlayer();

        if(activePlayer.actionQueue.length === activePlayer.maxActions)
        {
            if(this.turnPhase === TURN_PHASES.PLAYER_1_INPUT)
            {
                this.turnPhase = TURN_PHASES.PLAYER_2_INPUT;

                if(this.ai)
                {
                    this.ai.StartPlanningTurn();
                }
            }
            else if(this.turnPhase === TURN_PHASES.PLAYER_2_INPUT)
            {
                this.StartActionPhase();
            }
        }
    }

    PlayerActionsCompleted(player)
    {
        for(let i = 0; i < this.players.length; i ++)
        {
            if(this.players[i] === player)
            {
                this.playerWaits[i] = false;
                break;
            }
        }

        let allComplete = true;

        for(let i = 0; i <this.playerWaits.length; i ++)
        {
            if(this.playerWaits[i])
            {
                allComplete = false;
                break;
            }
        }

        if(allComplete)
        {
            this.StartNewInputPhase(true);
        }
    }

    PlayerKilled(player)
    {
        this.turnPhase = TURN_PHASES.MENU;        
    }

    EndRoundPopUp()
    {
        let winnerNum = -1;

        for(let i = 0; i < this.players.length; i ++)
        {
            if(this.players[i].alive)
            {
                winnerNum = this.players[i].playerNumber;
            }
        }

        let winText = "WIN_TEXT";

        if(winnerNum < 0)
        {
            winText = "Draw...";
        }
        else 
        {
            winText = `Player ${winnerNum} wins!`;
        }

        consoleLog("Create end round popup!");

        let flow = this;

        this.endRoundScreen = new PopUp(this.endRoundConfig.components, { 
            winnerText: winText,
            rematchEvt: () => { flow.ResetPlayers(); },
            quitEvt: () => { flow.LoadMainMenu(); }
         });
        DATA.IncrementPlayerScore(winnerNum, 1);
    }

    StartNewInputPhase(deteriorate)
    {
        this.turnPhase = TURN_PHASES.PLAYER_1_INPUT;

        if(deteriorate) this.arena.DeteriorateArena(this.deteriorator);

        for(let i = 0; i < this.players.length; i ++)
        {
            this.players[i].CheckForFloor();
        }
    }

    GetOtherPlayers(notThisOne)
    {
        let others = [];

        for(let i = 0; i < this.players.length; i ++)
        {
            if(this.players[i] !== notThisOne)
            {
                others.push(this.players[i]);
            }
        }

        return others;
    }

    PopActionQueue()
    {
        let player = this.GetActivePlayer();

        player.PopActionQueue();
    }

    QueueAction(action)
    {
        let player = this.GetActivePlayer();
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
        if(this.turnPhase === TURN_PHASES.MENU && this.popDelayTimer < this.popDelay)
        {
            this.popDelayTimer += deltaTime;
            if(this.popDelayTimer > this.popDelay)
            {
                this.EndRoundPopUp();
            }
        }
    }
}