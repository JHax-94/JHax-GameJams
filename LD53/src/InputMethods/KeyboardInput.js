import { consoleLog } from "../main";

export default class KeyboardInput
{
    constructor()
    {
        this.left = 0;
        this.up = 0;
        this.right = 0;
        this.down = 0;

    }

    SetState(src)
    {
        /*consoleLog("Set input state from..");
        consoleLog(src);*/

        this.left = src.left ? 1 : 0;
        this.right = src.right ? 1 : 0;
        this.up = src.up ? 1 : 0;
        this.down = src.down ? 1 : 0;
    }
}