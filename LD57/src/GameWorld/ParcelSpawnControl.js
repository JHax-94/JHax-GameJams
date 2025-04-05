import { EM } from "../main";

export default class ParcelSpawnControl
{
    constructor(gameWorld)
    {
        this.gameWorld = gameWorld;
        //EM.RegisterEntity(this);

        this.spawnRange = 2;

        this.spawnTime = 6;
        this.spawnTimer = 0;

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

        sourcePlanet.SpawnParcel(targetPlanet);
    }

    ProcessUpdate(deltaTime)
    {
        this.spawnTimer += deltaTime;
        if(this.spawnTimer >= this.spawnTime)
        {
            this.SpawnParcel();
            this.spawnTimer -= this.spawnTime;
        }
    }
}