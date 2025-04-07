import { UPGRADE_STRINGS } from "../Enums/UpgradeStrings";
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
            else if(upgradeData.type === "BoostRefuel")
            {
                upgradeTarget.upkeep += upgradeData.upkeep;                
                upgradeTarget.refuelRate += 4;

                upgradeTarget.permanentUpgrades.AddPermanentUpgrade("Refuel Rate+");

                upgradeComplete = true;
            }
            else if(upgradeData.type === "Unlock_CargoUpgrade")
            {
                upgradeTarget.upkeep += upgradeData.upkeep;
                upgradeTarget.permanentUpgrades.AddPermanentUpgrade(UPGRADE_STRINGS.FREIGHTER_CARGO_ON_STATION);

                upgradeComplete = true;
            }
            else if(upgradeData.type === "UpgradeCargo")
            {
                
                if(upgradeTarget.parcelStore.capacity < 12)
                {
                    upgradeTarget.upkeep += upgradeData.upkeep;
                    upgradeTarget.permanentUpgrades.AddPermanentUpgrade(UPGRADE_STRINGS.FREIGHTER_CARGO);

                    upgradeTarget.parcelStore.capacity ++;
                    upgradeComplete = true;
                }
            }
            else if(upgradeData.type === "Unlock_SpeedUpgrade")
            {
                upgradeTarget.upkeep += upgradeData.upkeep;
                upgradeTarget.permanentUpgrades.AddPermanentUpgrade(UPGRADE_STRINGS.FREIGHTER_SPEED_ON_STATION);
                upgradeComplete = true;
            }
            else if(upgradeData.type === "UpgradeSpeed")
            {
                upgradeTarget.upkeep += upgradeData.upkeep;
                upgradeTarget.permanentUpgrades.AddPermanentUpgrade(UPGRADE_STRINGS.FREIGHTER_SPEED);

                upgradeTarget.maxSpeed += 5;
                upgradeTarget.thrustForce += 5000;

                upgradeComplete = true;
            }
            else if(upgradeData.type === "SortSpeed")
            {
                upgradeTarget.upkeep += upgradeData.upkeep;
                upgradeTarget.permanentUpgrades.AddPermanentUpgrade("Sort Speed+");

                upgradeTarget.sortRate += 0.05;

                upgradeComplete = true;
            }
            else if(upgradeData.type === "BoostGrace")
            {
                upgradeTarget.permanentUpgrades.AddPermanentUpgrade("Grace+");
                upgradeTarget.baseGracePeriod += 45;

                upgradeComplete = true;
            }
            else if(upgradeData.type === "NewStation")
            {
                upgradeTarget.BuildStationNearby();
                upgradeComplete = true;
            }
            else if(upgradeData.type === "RaiseCharge")
            {
                upgradeTarget.baseReward += 10;
                upgradeComplete = true;
            }

            if(upgradeComplete === false)
            {
                console.error("Unhandled upgrade!");
                consoleLog(upgradeData);
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