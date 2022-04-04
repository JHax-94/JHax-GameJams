import AbstractMenu from "./AbstractMenu";
import { consoleLog, EM, SETUP } from "./main";

export default class GameOverMenu extends AbstractMenu
{
    constructor(onLevel)
    {
        super("GameOverMenu");

        this.levelName = onLevel;

        let menuRef = this;

        this.buttonMethods.BackToMenu = this.BackToMenu;
        this.buttonMethods.Restart = function() { menuRef.Restart(); };

        this.BuildComponents();

        let clock = EM.GetEntity("Clock");

        for(let i = 0; i < this.components.length; i ++)
        {
            let comp = this.components[i];

            consoleLog("Check component for time sub");
            consoleLog(comp);

            if(comp.type === "Text" && comp.text === "##TIME##")
            {
                comp.text = `${clock.time.m} minutes and ${clock.time.s} seconds!`;
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
