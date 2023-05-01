import { clearTutorialData } from "../main";
import Menu from "./Menu";

export default class StorageMenu extends Menu
{
    constructor(config)
    {
        super(config);
    }

    ClearTutorialData()
    {
        clearTutorialData();
    }

    ClearScores()
    {

    }
}