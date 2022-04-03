import { consoleLog, EM, getObjectConfig } from "./main";

export default class PickupSpawner
{
    constructor()
    {
        let objConf = getObjectConfig("PickupSpawner");

        this.spawnTimer = 0;
        this.spawnThreshold = objConf.spawnInterval;

        this.pickupsList = [];

        this.spawnLocations = [];

        this.ConstructPickupsList();

        EM.RegisterEntity(this);
    }

    ConstructPickupsList()
    {
        let objectConfig = assets.objectConfig.objectMap;

        let pickupConfigs = objectConfig.filter(val => val.isPickup);

        consoleLog("Pickup Configs:");
        consoleLog(pickupConfigs);

        for(let i = 0; i < pickupConfigs.length; i ++)
        {
            this.pickupsList.push({ name: pickupConfigs[i].name, spriteIndex: pickupConfigs[i].index });
        }
    }

    Update(deltaTime)
    {
        this.spawnTimer += deltaTime;

        if(this.spawnTimer >= this.spawnThreshold)
        {
            this.spawnTimer -= this.spawnThreshold;

            this.SpawnPickup();
        }
    }

    AddLocation(spawnLocation)
    {
        this.spawnLocations.push(spawnLocation);
    }

    SpawnPickup()
    {
        consoleLog(`Random: ${random(2)}`);

        let spawnablePoints = this.spawnLocations.filter((spawnLoc) => spawnLoc.CanSpawn());

        if(spawnablePoints.length > 0)
        {
            let index = random(spawnablePoints.length);

            consoleLog(`Spawn at spawn location ${index}`);
            consoleLog(spawnablePoints[index]);

            let spawnObject = this.pickupsList[random(this.pickupsList.length)];

            spawnablePoints[index].SpawnObject(spawnObject);
        }
    }
}
