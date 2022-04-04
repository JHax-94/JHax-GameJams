import AbstractMenu from "./AbstractMenu";
import { EM, SETUP } from "./main";
//import { getObjectConfig } from "./main";

export default class PauseMenu extends AbstractMenu
{
    constructor()
    {
        super("PauseMenu");
        
        this.buttonMethods.BackToMenu = this.BackToMenu;
        this.buttonMethods.Unpause = this.Unpause;

        this.BuildComponents();

        this.SetFocus(this.focusedButton);
    }

    Unpause()
    {
        EM.Pause();
    }

    BackToMenu()
    {
        SETUP();
    }

}