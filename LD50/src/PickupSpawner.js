import { consoleLog, EM, getObjectConfig } from "./main";

export default class PickupSpawner
{
    constructor()
    {
        let objConf = getObjectConfig("PickupSpawner");


        this.elapsedTime = 0;
        this.spawnTimer = 0;
        this.spawnThreshold = objConf.spawnInterval;

        this.pickupsList = [];

        
        
        this.spawnWeightings = objConf.spawnWeightings[0].weightings;

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
        this.elapsedTime += deltaTime;

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

    GetWeightedList()
    {
        /*
        consoleLog("Build weighted spawn list");

        consoleLog(this.pickupsList);
        consoleLog(this.spawnWeightings);
        */
        let weightings = {
            totalWeight: 0,
            pickupWeights: []
        };

        for(let i = 0; i < this.pickupsList.length; i ++)
        {
            let pickupName = this.pickupsList[i].name;

            //consoleLog(`Get weightings for pickup: ${pickupName}`);

            let pickup = this.spawnWeightings.find((val, index) => { /*consoleLog(`Find by:`); consoleLog(val);*/ return val.powerName === pickupName  });

            //consoleLog(pickup);

            for(let j = 0; j < pickup.weightings.length; j ++)
            {
                let useThisWeight = false;

                if(j + 1 >= pickup.weightings.length)
                {
                    useThisWeight = true;
                }
                else if(pickup.weightings[j].time <= this.elapsedTime && pickup.weightings[j+1].time > this.elapsedTime)
                {
                    useThisWeight = true;
                }

                if(useThisWeight)
                {
                    /*
                    consoleLog("----- USING WEIGHT -----");

                    consoleLog(pickup.weightings[j]);
                    */
                    weightings.pickupWeights.push({
                        pickup: this.pickupsList[i],
                        weight: pickup.weightings[j].weighting
                    });

                    weightings.totalWeight += pickup.weightings[j].weighting;
                    /*
                    consoleLog("WEIGHTING ADDED");
                    consoleLog(weightings);*/
                    break;
                }
            }
        }

        return weightings;
    }

    SpawnPickup()
    {
        let spawnablePoints = this.spawnLocations.filter((spawnLoc) => spawnLoc.CanSpawn());

        let weightedList = this.GetWeightedList();

        if(spawnablePoints.length > 0)
        {
            let randomWeight = random(weightedList.totalWeight + 1);

            let index = random(spawnablePoints.length);

            let pickupIndex = 0;

            while(randomWeight > 0)
            {
                randomWeight -= weightedList.pickupWeights[pickupIndex].weight;

                if(randomWeight > 0)
                {
                    pickupIndex ++;
                }
            }

            let spawnObject = weightedList.pickupWeights[pickupIndex].pickup;

            spawnablePoints[index].SpawnObject(spawnObject);
        }
    }
}
