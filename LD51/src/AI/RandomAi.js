import BasicAttackAction from "../Characters/BasicAttackAction";
import ChangeStance from "../Characters/ChangeStance";
import MoveAction from "../Characters/MoveAction";
import TurnAction from "../Characters/TurnAction";
import { getObjectConfig } from "../main";
import AbstractAi from "./AbstractAi";

export default class RandomAi extends AbstractAi
{
    constructor()
    {
        super();

        this.actionSource = getObjectConfig("RandomAi").actions;

        this.maxActionScore = 0;
        for(let i = 0; i < this.actionSource.length; i ++)
        {
            this.maxActionScore += this.actionSource[i].weight;
        }
    }

    AddAction()
    {
        let taskScore = random(this.maxActionScore-1) + 1;

        let action = null;

        for(let i = 0; i < this.actionSource.length; i ++)
        {
            taskScore -= this.actionSource[i].weight;

            if(taskScore <= 0)
            {
                action = this.actionSource[i];
                break;
            }
        }

        let queueAction = null;

        if(action.type === "Move")
        {
            queueAction = new MoveAction();
        }
        else if(action.type === "Turn")
        {
            queueAction = new TurnAction(action.dir);
        }
        else if(action.type === "Stance")
        {
            queueAction = new ChangeStance(action.dir);
        }
        else if(action.type === "Attack")
        {
            queueAction = new BasicAttackAction();
        }

        this.player.AddToActionQueue(queueAction);
    }
}