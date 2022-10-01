import Action from "./Action";

export default class TurnAction extends Action
{
    constructor(clockDir)
    {
        super(`Turn ${clockDir > 0 ? "Clockwise" : "AntiClockwise"}`);
    }
}