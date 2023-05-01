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

        if(btnState && btnIn == false)
        {
            triggered = true;
        }

        return triggered;
    }

    SetState(src)
    {
        /*
        consoleLog("Set input state from..");
        consoleLog(src);*/

        this.left = (src.left || src.a) ? 1 : 0;
        this.right = (src.right || src.d) ? 1 : 0;
        this.up = (src.up || src.w) ? 1 : 0;
        this.down = (src.down || src.s) ? 1 : 0;

        let action1 = (src.action1 || src.num1) ? 1 : 0;
        let action2 = (src.action2 || src.num2) ? 1 : 0;
        let action3 = (src.action3 || src.num3) ? 1 : 0;
        let action4 = (src.action4 || src.num4) ? 1 : 0;
        let action5 = (src.action5 || src.num5) ? 1 : 0;

        this.action1Triggered = this.CheckForTrigger(this.action1, action1);
        this.action1 = action1;

        this.action2Triggered = this.CheckForTrigger(this.action2, action2);
        this.action2 = action2;

        this.action3Triggered = this.CheckForTrigger(this.action3, action3);
        this.action3 = action3;

        this.action4Triggered = this.CheckForTrigger(this.action4, action4);
        this.action4 = action4;

        this.action5Triggered = this.CheckForTrigger(this.action5, action5 );
        this.action5 = action5;

        this.eTriggered = this.CheckForTrigger(this.e, src.e);
        this.e = src.e;

        this.escTriggered = this.CheckForTrigger(this.esc, src.esc);
        this.esc = src.esc;
    }
}