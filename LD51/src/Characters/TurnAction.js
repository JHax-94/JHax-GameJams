import Action from "./Action";

export default class TurnAction extends Action
{
    constructor(clockDir)
    {
        super(`Turn ${clockDir > 0 ? "Clockwise" : "AntiClockwise"}`);

        this.clockDir = clockDir;
    }

    ExecuteAction(player)
    {
        this.targetPlayer = player;
    }

    ActionComplete()
    {
        this.targetPlayer.direction = (4 + this.targetPlayer.direction + this.clockDir) % 4;
        super.ActionComplete();
    }
}