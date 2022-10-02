import Action from "../Characters/Action";
import BasicAttackAction from "../Characters/BasicAttackAction";
import ChangeStance from "../Characters/ChangeStance";
import MoveAction from "../Characters/MoveAction";
import TurnAction from "../Characters/TurnAction";
import { consoleLog, DIRECTIONS, EM, getObjectConfig, UTIL } from "../main";
import AbstractAi from "./AbstractAi";

export default class BasicAi extends AbstractAi
{
    constructor()
    {
        super();

        this.floorTileIndex =  getObjectConfig("FloorTile").index;
        this.damagedTileIndex = getObjectConfig("DamagedFloorTile").index;
        this.enemyPlayer = null;

        this.thinkAhead = [];
    }

    StartPlanningTurn()
    {
        super.StartPlanningTurn();
        this.thinkAhead = [];

        consoleLog("---- START AI TURN ---- ");
    }

    SetPlayer(player)
    {
        super.SetPlayer(player);

        this.enemyPlayer = player.FlowManager().GetOtherPlayers(player)[0];
    }

    ProjectedState()
    {
        let startDir = this.player.direction;
        let startTile = this.player.tilePos;

        let state = {
            pos: { x: startTile.x, y: startTile.y },
            dir: this.player.direction,
            stance: this.player.stance
        };

        let queue = this.player.actionQueue;
        for(let i = 0; i < queue.length; i ++)
        {
            consoleLog("Proj State")

            let act = queue[i];

            if(act.type === "Move")
            {
                let forwardVec = UTIL.GetForwardVec(state.dir);

                state.pos = UTIL.VecAdd(state.pos, forwardVec);
            }

            if(act.type === "Turn")
            {
                state.dir = (state.dir + 4 + act.clockDir) % 4;
            }

            if(act.type === "Stance")
            {
                state.stance = this.player.GetStanceInDir(act.changeDir);
            }
        }

        return state;
    }

    AddAction()
    {
        let action = null;

        consoleLog("Basic think...");

        if(this.thinkAhead.length > 0)
        {
            action = this.thinkAhead[0];
            this.thinkAhead.splice(0, 1);
        }
        else
        {
            let map = EM.GetEntity("ARENA");
            let pState = this.ProjectedState();
            consoleLog("PROJECTED STATE --- ");
            consoleLog(pState);

            if(this.enemyPlayer.stance.beats === pState.stance.name) // Change stance if enemy stance beats mine
            {
                action = new ChangeStance(-1);
            }
            else if(this.enemyPlayer.stance.name === pState.stance.name)
            {
                action = new ChangeStance(1);
            }

            let fwdTile = map.GetWorldTile(UTIL.VecAdd(pState.pos, UTIL.GetForwardVec(pState.dir)));
            let rightTile = map.GetWorldTile(UTIL.VecAdd(pState.pos, UTIL.GetForwardVec((pState.dir + 1 + 4) % 4)));
            let leftTile = map.GetWorldTile(UTIL.VecAdd(pState.pos, UTIL.GetForwardVec((pState.dir - 1 + 4) % 4)));

            if(!action) /// Avoid Being on a damaged tile
            {
                let tile = map.GetWorldTile(pState.pos);

                if(tile && tile.sprite === this.damagedTileIndex)
                {
                    if(fwdTile && fwdTile.sprite !== this.damagedTileIndex)
                    {
                        action = new MoveAction();
                    }
                    else
                    {
                        if(rightTile && rightTile.sprite !== this.damagedTileIndex)
                        {
                            action = new TurnAction(1);
                            this.thinkAhead.push(new MoveAction());
                        }
                        else if(leftTile && leftTile.sprite !== this.damagedTileIndex)
                        {
                            action = new TurnAction(-1);
                            this.thinkAhead.push(new MoveAction());
                        }
                    }

                    if(!action)
                    {
                        let turnDir = random(2);

                        action = new TurnAction(turnDir);

                        this.thinkAhead.push(new TurnAction(turnDir));
                        this.thinkAhead.push(new MoveAction());
                    }
                }
            }

            if(!action) // Move Toward enemy last know position, try attacks sometimes
            {
                let enemyPos = this.enemyPlayer.tilePos;

                let playerDist = UTIL.GetSqrDistance(pState.pos, enemyPos);

                let attackRoll = random((12 - this.player.actionQueue.length));

                consoleLog(`Attack roll: ${attackRoll}`);

                if(playerDist < (3 + (this.player.actionQueue.length)) && attackRoll === 0)
                {
                    action = new BasicAttackAction();
                }

                if(!action)
                {
                    if(fwdTile && fwdTile.sprite !== this.damagedTileIndex)
                    {
                        consoleLog("Get Fwd dist");
                        
                        let fwdDist = UTIL.GetSqrDistance(fwdTile, enemyPos);

                        consoleLog(`Fwd: ${fwdDist} v Player: ${playerDist}`);

                        if(fwdDist < playerDist)
                        {
                            action = new MoveAction();
                        }
                    }
                }

                if(!action)
                {
                    if(leftTile && leftTile.sprite !== this.damagedTileIndex)
                    {
                        consoleLog("Get left dist");

                        let leftDist = UTIL.GetSqrDistance(leftTile, enemyPos);

                        consoleLog(`Left: ${leftDist} v Player: ${playerDist}`);

                        if(leftDist < playerDist)
                        {
                            action = new TurnAction(-1);
                        }
                    }                    
                }

                if(!action)
                {
                    if(rightTile && rightTile.sprite !== this.damagedTileIndex)
                    {
                        consoleLog("Get right dist");

                        let rightDist = UTIL.GetSqrDistance(rightTile, enemyPos);

                        consoleLog(`Right: ${rightDist} v Player: ${playerDist}`);

                        if(rightDist < playerDist)
                        {
                            action = new TurnAction(1);
                        }
                    }
                }

                if(!action)
                {
                    //let fwdTile = map.GetWorldTile(pState.pos, UTIL.GetForwardVec(pState.dir));

                    let randomFallback = random(3);
                    if(randomFallback > 1)
                    {
                        action = new BasicAttackAction();
                    }
                    else
                    {
                        action = new TurnAction(randomFallback % 2);
                    }
                }
            }

            /*
            if(!action && this.player.tilePos)
            {
                let worldTile = map.GetWorldTile(this.player.tilePos);

                if(worldTile.sprite === this.damagedTileIndex)
                {
                    let upTile = map.GetWorldTile({ x: worldTile.x + 0, y: worldTile.y - 1 });
                    let leftTile = map.GetWorldTile({ x: worldTile.x - 1, y: worldTile.y });
                    let rightTile = map.GetWorldTile({ x: worldTile.x + 1, y: worldTile.y });
                    let downTile = map.GetWorldTile({ x: worldTile.x + 0, y: worldTile.y + 1 });


                    
                }
            }*/
        }

        if(action)
        {
            consoleLog("==== QUEUE ACTION ====");
            consoleLog(action);
            this.player.AddToActionQueue(action);
        }
    }

}