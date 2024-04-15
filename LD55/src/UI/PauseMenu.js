import Menu from "./Menu";
import { consoleLog, EM, PIXEL_SCALE} from "../main";

export default class PauseMenu extends Menu
{
    constructor(menuConf)
    {
        super(menuConf, { title: "Pause" });
    }

    Resume()
    {
        EM.Pause();
    }

    ButtonStartClick()
    {
        this.Resume();
    }

    Close()
    {
        super.ClearComponents();
        EM.RemoveEntity(this);
    }
}