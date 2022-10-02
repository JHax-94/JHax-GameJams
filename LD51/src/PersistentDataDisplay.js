import { consoleLog, DATA, EM, getObjectConfig, PIXEL_SCALE } from "./main"

export default class PersistentDataDisplay
{
    constructor()
    {
        this.ui = getObjectConfig("PersistentDataDisplay");

        consoleLog("Data Display config");
        consoleLog(this.ui);

        EM.RegisterEntity(this);
    }

    DrawPlayerDisplay(display, score)
    {
        let scoreString = "00";

        if(score < 10)
        {
            scoreString = "0" + score.toString();
        }
        else
        {
            scoreString = score;
        }

        print(`V:${scoreString}`, display.x * PIXEL_SCALE, display.y * PIXEL_SCALE);
    }

    Draw()
    {   /*
        consoleLog("DRAW DATA");
        consoleLog(DATA);*/
        if(this.ui.player1Display)
        {
            this.DrawPlayerDisplay(this.ui.player1Display, DATA.player1Wins);
        }

        if(this.ui.player2Display)
        {
            this.DrawPlayerDisplay(this.ui.player2Display, DATA.player2Wins);
        }
    }
}