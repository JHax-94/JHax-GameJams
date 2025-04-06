import { EM } from "../main";

export default class ParcelSpawnControl
{
    constructor(gameWorld)
    {
        this.gameWorld = gameWorld;
        //EM.RegisterEntity(this);

        this.spawnRange = 3;

        this.spawnTime = 10;
        this.spawnTimer = 0;

        this.elapsedTimer = 0;

        this.sortedTimer = 0;
        this.sortedRollThreshold = 20;
        this.sortedRoll = 0;

        this.penaltyCost = 100;
    }

    SpawnParcel()
    {
        let spawnMax = this.spawnRange > this.gameWorld.planets.length ? this.gameWorld.planets.length : this.spawnRange;

        let planetsList = [];

        for(let i = 0; i < spawnMax; i ++)
        {
            planetsList.push(this.gameWorld.planets[i]);
        }

        let spawnAt = random(spawnMax);

        let sourcePlanet = planetsList[spawnAt];

        planetsList.splice(spawnAt, 1);

        let targetIndex = random(planetsList.length);

        let targetPlanet = planetsList[targetIndex];

        let spawnAsSorted = this.SpawnAsSorted();

        if(sourcePlanet.parcelStore.RemainingCapacity() === 0)
        {
            this.gameWorld.ProcessPenalty(`No room for new cargo at ${sourcePlanet.title}`, this.penaltyCost);
        }
        else
        {
            sourcePlanet.SpawnParcel(targetPlanet, spawnAsSorted);
        }
    }

    SpawnAsSorted()
    { 
        let spawnAsSorted = false;

        if(this.sortedRoll > 1)  
        {
            if(random(this.sortedRoll) == 0)
            {
                spawnAsSorted = true;
            }
        }
        else
        {
            spawnAsSorted = true;
        }

        return spawnAsSorted;
    }

    ProcessUpdate(deltaTime)
    {
        this.spawnTimer += deltaTime;
        if(this.spawnTimer >= this.spawnTime)
        {
            this.SpawnParcel();
            this.spawnTimer -= this.spawnTime;
        }

        this.sortedTimer += deltaTime;

        if(this.sortedTimer >= this.sortedRollThreshold)
        {
            this.sortedRoll ++;
            this.sortedTimer -= this.sortedRollThreshold;
        }


        this.elapsedTimer += deltaTime;
    }
}