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

        this.lastRoll = null;
    }

    SpawnParcel()
    {
        let spawnMax = this.gameWorld.planets.length;

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

    SpawnAsSortedProbability()
    {
        let spawnAsSortedProbability = 1;

        if(this.gameWorld.WeeksPassed() >= 1)
        {
            spawnAsSortedProbability = 0.9;
            
            spawnAsSortedProbability -= 0.02 * (this.gameWorld.daysPassed - this.gameWorld.daysPerWeek) / this.gameWorld.daysPerWeek;

            if(spawnAsSortedProbability < 0.2)
            {
                spawnAsSortedProbability = 0.2;
            }
        }

        return spawnAsSortedProbability;
    }

    SpawnAsSorted()
    { 
        let spawnAsSorted = false;

        
        let pSpawnAsSorted = this.SpawnAsSortedProbability();

        let roll = random(101);


        this.lastRoll = roll;
        if(roll <= Math.ceil(pSpawnAsSorted * 100))
        {
            spawnAsSorted = true;
        }

        return spawnAsSorted;
    }

    ProcessUpdate(deltaTime)
    {
        //EM.hudLog.push(this.SpawnAsSortedProbability());
        if(this.lastRoll !== null)
        {
            EM.hudLog.push(`Last roll: ${this.lastRoll}`);
        }
        
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