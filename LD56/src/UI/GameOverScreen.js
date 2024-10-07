import { BASE_DISTANCE, consoleLog, EM, SETUP } from "../main";
import EndScreen from "./EndScreen";

export default class GameOverScreen extends EndScreen
{
    constructor(gameOverReason)
    {
        super("Game Over");

        this.reason = gameOverReason;

        this.distance = EM.GetEntity("GAMEWORLD").maxDistance;

        let options = [ { text: `RESET`, callback: this.Restart } ];

        let _this = this;
        if(this.distance > BASE_DISTANCE)
        {
            options.unshift({ text: `TRY AGAIN (DISTANCE: ${this.distance})`, callback: () => { _this.ResetWithDistance(); } });
        }

        this.BuildButtons(options);
    }

    ResetWithDistance()
    {
        SETUP({ distance: this.distance });
    }

    Draw()
    {
        super.Draw();

        for(let i = 0; i < this.reason.length; i ++)
        {
            this.DrawCentredText(this.reason[i], 3 + i);
        }
    }
}