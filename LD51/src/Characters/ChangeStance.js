import Action from "./Action";

export default class ChangeStance extends Action
{
    constructor(changeStance)
    {
        super(`Stance ${changeStance > 0 ? "Anti Clockwise" : "Clockwise"}`, "Stance");
        
        this.changeDir = changeStance;
    }

    ExecuteAction(player)
    {
        this.targetPlayer = player;
    }

    ActionComplete()
    {
        this.targetPlayer.ChangeStance(this.changeDir);
        super.ActionComplete();
    }
}