import AbstractMenu from "./AbstractMenu";
import { consoleLog, SETUP } from "./main";

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
