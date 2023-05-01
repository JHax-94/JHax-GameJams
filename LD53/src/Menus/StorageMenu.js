import { EM, SETUP, clearScoreData, clearTutorialData, consoleLog } from "../main";
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
        clearScoreData();
        EM.ClearDown();
        SETUP();
    }
}