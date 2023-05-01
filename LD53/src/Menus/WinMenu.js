import { EM, SETUP, consoleLog, getPlayerPref, setPlayerPref } from "../main";
import Menu from "./Menu";

export default class WinMenu extends Menu
{
    constructor(level, config)
    {
        super(config);

        this.level = level;
    }

    Quit()
    {
        consoleLog("End Level:");
        consoleLog(this.level);

        let bestGold = getPlayerPref(`topGold_${this.level.levelName}`);
        
        let player = EM.GetEntity("PLAYER");

        let gold= player.GetItem("Gold");

        consoleLog("Player gold:");
        consoleLog(gold);

        if(!bestGold || gold.quantity > bestGold)
        {
            setPlayerPref(`topGold_${this.level.levelName}`, gold.quantity);
        }

        SETUP("MainMenu");
    }

}