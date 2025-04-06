import { consoleLog, EM } from "../main";

export default class UpgradeProcessor
{
    constructor()
    {
        this.gameWorld = null;
    }

    GameWorld()
    {
        if(this.gameWorld === null)
        {
            this.gameWorld = EM.GetEntity("GAME_WORLD");
        }

        return this.gameWorld;
    }

    ProcessUpgrade(upgradeData, upgradeTarget)
    {
        let upgradeComplete = false;

        if(upgradeData.type === "NewFreighter")
        {
            upgradeTarget.SpawnFreighter();
            upgradeComplete = true;
        }
        else if(upgradeData.type === "NewTanker")
        {
            upgradeTarget.SpawnTanker();
            upgradeComplete = true;
        }
        else if(upgradeData.type === "NewShuttle")
        {
            upgradeTarget.SpawnShuttle();
            upgradeComplete = true;
        }
        else if(upgradeData.type === "SendProbe")
        {
            upgradeTarget.SendProbe();
            upgradeComplete = true;
        }

        

        if(upgradeComplete && upgradeData.cost > 0)
        {
            this.GameWorld().ProcessPurchase(upgradeData.cost);
        }
    }
}