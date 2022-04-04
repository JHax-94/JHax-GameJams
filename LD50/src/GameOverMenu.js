import AbstractMenu from "./AbstractMenu";
import { consoleLog, EM, getPlayerPref, setPlayerPref, SETUP } from "./main";

export default class GameOverMenu extends AbstractMenu
{
    constructor(onLevel)
    {
        super("GameOverMenu");

        this.levelName = onLevel;

        let bestTime = 0;

        let pb = getPlayerPref(`PB_${this.levelName}`);

        if(pb !== null)
        {
            bestTime = parseFloat(pb);
        }

        let menuRef = this;

        this.buttonMethods.BackToMenu = this.BackToMenu;
        this.buttonMethods.Restart = function() { menuRef.Restart(); };

        this.BuildComponents();

        let clock = EM.GetEntity("Clock");

        consoleLog("CLOCK FOR GAME OVER");
        consoleLog(clock);

        let totalTime = clock.TotalSeconds();

        let newPb = false;

        if(totalTime > bestTime)
        {
            setPlayerPref(`PB_${this.levelName}`, totalTime);
            newPb = true;
        }

        for(let i = 0; i < this.components.length; i ++)
        {
            let comp = this.components[i];

            if(comp.type === "Text" && comp.text === "##TIME##")
            {
                consoleLog("End game clock");
                consoleLog(clock);

                comp.overwriteText = `${clock.time.m} minutes and ${clock.time.s} seconds!`;
            }

            if(comp.type === "Text" && comp.text == "##PB##")
            {
                if(newPb)
                {
                    comp.overwriteText = "New Personal Best!";
                }
                else
                {
                    comp.overwriteText = " ";
                }
            }
        }

        this.SetFocus(this.focusedButton);
    }

    Restart(levelName)
    {
        SETUP(this.levelName);
    }

    BackToMenu()
    {
        SETUP();
    }
}
