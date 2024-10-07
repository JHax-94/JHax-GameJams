import { EM } from "../main";
import EndScreen from "./EndScreen";

export default class PlanBeePauseMenu extends EndScreen
{
    constructor()
    {
        super("PAUSE");

        let _this = this;

        this.BuildButtons([ { text: "RESUME", callback: () => { _this.Resume(); } }]);

        this.waitForEscUp = false;
    }

    InputDetect(input)
    {
        if(!this.destroyed)
        {
            if(btn.esc && !this.waitForEscUp)
            {
                this.waitForEscUp = true;
            }
            else if(this.waitForEscUp && !btn.esc)
            {
                this.waitForEscUp = false;
                this.Resume();
            }
        }
    }

    Resume()
    {
        this.Destroy();
        EM.Unpause();
    }
}