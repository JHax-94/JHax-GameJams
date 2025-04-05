import { consoleLog } from "../main";

export default class UpgradeProcessor
{
    constructor()
    {

    }

    ProcessUpgrade(upgradeData, upgradeTarget)
    {
        consoleLog("Processing Upgrade:");
        consoleLog(upgradeData);
        consoleLog(upgradeTarget);


    }
}