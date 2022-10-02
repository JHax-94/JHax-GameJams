import Action from "./Action";

export default class ChangeStance extends Action
{
    constructor(changeStance)
    {
        super(`Change Stance ${changeStance}`, "Stance");

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