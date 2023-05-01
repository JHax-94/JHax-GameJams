import { EM, consoleLog, setPlayerPref } from "../main";
import Menu from "./Menu";

export default class TutorialMenu extends Menu
{
    constructor(tutorialId, config)
    {
        super(config);
        this.tutorialId = tutorialId;
    }

    Close()
    {
        let playerPrefKey = `seenTutorial_${this.tutorialId}`;

        consoleLog("Closing tutorial...");
        consoleLog(this);

        setPlayerPref(playerPrefKey, true);

        super.Close();

        let manager = EM.GetEntity("LEVEL_MANAGER");
        manager.NextTutorial();
    }
}