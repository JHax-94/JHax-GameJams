import { consoleLog } from "../main";

export default class KeyboardInput
{
    constructor()
    {
        this.left = 0;
        this.up = 0;
        this.right = 0;
        this.down = 0;

        this.action1 = false;
        this.action1Triggered = false;
    }


    CheckForTrigger(btnState, btnIn)
    {
        let triggered = false;

        if(btnState && btnIn === false)
        {
            triggered = true;
        }

        return triggered;
    }

    SetState(src)
    {
        /*consoleLog("Set input state from..");
        consoleLog(src);*/

        this.left = (src.left || src.a) ? 1 : 0;
        this.right = (src.right || src.d) ? 1 : 0;
        this.up = (src.up || src.w) ? 1 : 0;
        this.down = (src.down || src.s) ? 1 : 0;

        this.action1Triggered = this.CheckForTrigger(this.action1, src.action1);
        this.action1 = src.action1;
    }
}