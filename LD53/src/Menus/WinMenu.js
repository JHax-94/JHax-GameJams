import { SETUP } from "../main";
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
        SETUP("MainMenu");
    }

}