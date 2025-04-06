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
        let gameWorld= this.GameWorld();
        let upgradeComplete = false;

        if(gameWorld.player.credits > upgradeData.cost)
        {
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
                
                gameWorld.ProcessPurchase(upgradeData.cost);
            }     
        }
        else
        {
            gameWorld.toastManager.AddMessage("Can't afford upgrade", 10);
        }
    }
}