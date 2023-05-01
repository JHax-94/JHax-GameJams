import { EM, SETUP } from "../main";
import Menu from "./Menu";

export default class PauseMenu extends Menu
{
    constructor(config)
    {
        super(config);
    }

    Resume()
    {
        EM.Pause();
    }

    Quit()
    {
        SETUP("MainMenu");
    }
}