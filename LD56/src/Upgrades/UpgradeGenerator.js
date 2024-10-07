import { useProgram } from "pixelbox/webGL/context";
import UpgradeCitizenSpeed from "./UpgradeCitizenSpeed";
import UpgradeRespawnTime from "./UpgradeRespawnTime";
import UpgradeSwarmSize from "./UpgradeSwarmSize";
import Upgrade from "./Upgrade";
import UpgradeSpawnFlower from "./UpgradeSpawnFlower";
import UpgradeHivePopulationRate from "./UpgradeHivePopulationRate";
import UpgradeRoyalJelly from "./UpgradeRoyalJelly";
import UpgradeRespawnFlowers from "./UpgradeRespawnFlowers";
import { consoleLog, PIXEL_SCALE } from "../main";
import UpgradeSpawnHive from "./UpgradeSpawnHive";
import UpgradeHivePop from "./UpgradeHivePop";
import UpgradeBugRespawnRate from "./UpgradeBugRespawnRate";
import UpgradeFlowerPopulation from "./UpgradeFlowerPopulation";
import UpgradePlayerSpeed from "./UpgradePlayerSpeed";
import UpgradeDroneExp from "./UpgradeDroneExp";

export default class UpgradeGenerator
{
    constructor()
    {
        this.upgradeList = [
            { type: "SwarmSize", weight: 100 },
            { type: "RespawnTime", weight: 100 },
            { type: "CitizenSpeed", weight: 10 },
            { type: "SpawnFlower", weight: 50 },
            { type: "Repopulate", weight: 100 },
            { type: "RoyalJelly", weight: 10 },
            { type: "PopFlower", weight: 20 },
            { type: "SpawnHive", weight: 10 },
            { type: "HivePop", weight: 5 },
            { type: "FlowerPop", weight: 5 },
            { type: "PlayerSpeed", weight: 50 },
            { type: "DroneExp", weight: 3 },
        ];
    }

    BuildUpgrade(upgradeData)
    {
        switch(upgradeData.type)
        {
            case "SwarmSize":
                return new UpgradeSwarmSize(1);
            case "RespawnTime":
                return new UpgradeBugRespawnRate(0.1);
            case "CitizenSpeed":
                return new UpgradeCitizenSpeed(1);
            case "SpawnFlower":
                return new UpgradeSpawnFlower();
            case "Repopulate":
                return new UpgradeHivePopulationRate(0.1);
            case "RoyalJelly":
                return new UpgradeRoyalJelly();
            case "PopFlower":
                return new UpgradeRespawnFlowers();
            case "SpawnHive":
                return new UpgradeSpawnHive();
            case "HivePop":
                return new UpgradeHivePop(5);
            case "FlowerPop":
                return new UpgradeFlowerPopulation(1);
            case "PlayerSpeed":
                return new UpgradePlayerSpeed(2);
            case "DroneExp":
                return new UpgradeDroneExp(1);
            default:
                console.warn("UPGRADE TYPE NOT RECOGNISED");
                consoleLog(upgradeData);
                return new UpgradeSwarmSize(1);
        }
    }

    TotalWeight(list)
    {
        let weight = 0
        for(let i = 0; i < list.length; i ++)
        {
            weight += list[i].weight;
        }

        return weight;
    }

    GenerateUpgrades()
    {
        let freshList = [ ...this.upgradeList ];
        let returnList = [];

        for(let i = 0; i < 3; i ++)
        {
            let totalWeight = this.TotalWeight(freshList);

            let roll = random(totalWeight);

            let index = 0;

            let runningWeight = 0;
            for(let i = 0; i < freshList.length; i ++)
            {
                if(roll < runningWeight + freshList[i].weight)
                {
                    index = i;
                    break;
                }
                else 
                {
                    runningWeight += freshList[i].weight;
                }
            }

            consoleLog("BUILD UPGRADE FROM:");
            consoleLog(freshList[index]);

            returnList.push(this.BuildUpgrade(freshList[index]));
            freshList.splice(index, 1);
        }
        return returnList;
    }
}