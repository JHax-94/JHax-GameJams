import { consoleLog, SETUP } from "../main";
import EndScreen from "./EndScreen";

export default class GameOverScreen extends EndScreen
{
    constructor(gameOverReason)
    {
        super("Game Over");

        this.reason = gameOverReason;

        this.BuildButtons([ { text: "TRY AGAIN", callback: this.Restart } ]);
    }

    Restart()
    {
        consoleLog("Restart");

        SETUP();
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