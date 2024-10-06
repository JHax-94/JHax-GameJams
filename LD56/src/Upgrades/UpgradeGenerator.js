import { useProgram } from "pixelbox/webGL/context";
import UpgradeCitizenSpeed from "./UpgradeCitizenSpeed";
import UpgradeRespawnTime from "./UpgradeRespawnTime";
import UpgradeSwarmSize from "./UpgradeSwarmSize";
import Upgrade from "./Upgrade";
import UpgradeSpawnFlower from "./UpgradeSpawnFlower";
import UpgradeHivePopulationRate from "./UpgradeHivePopulationRate";

export default class UpgradeGenerator
{
    constructor()
    {
        this.upgradeList = [
            { type: "SwarmSize" },
            { type: "RespawnTime" },
            { type: "CitizenSpeed" },
            { type: "SpawnFlower"},
            { type: "Repopulate" }
        ];
    }

    BuildUpgrade(upgradeData)
    {
        switch(upgradeData.type)
        {
            case "SwarmSize":
                return new UpgradeSwarmSize(1);
            case "RespawnTime":
                return new UpgradeRespawnTime(0.1);
            case "CitizenSpeed":
                return new UpgradeCitizenSpeed(1);
            case "SpawnFlower":
                return new UpgradeSpawnFlower();
            case "Repopulate":
                return new UpgradeHivePopulationRate(0.1);
            default:
                console.warn("UPGRADE TYPE NOT RECOGNISED");
                consoleLog(upgradeData);
                return new UpgradeSwarmSize(1);
        }
    }

    GenerateUpgrades()
    {
        let freshList = [ ...this.upgradeList ];
        let returnList = [];

        for(let i = 0; i < 3; i ++)
        {
            let index = random(freshList.length);

            returnList.push(this.BuildUpgrade(freshList[index]));
            freshList.splice(index, 1);
        }

        return returnList;
    }
}