import { EM } from "../main";
import FlowerPatch from "../Pickups/FlowerPatch";
import Spawner from "./Spawner";

export default class FlowerSpawner extends Spawner
{
    constructor(gameWorld)
    {
        super(gameWorld);

        this.patches = [];

        this.spawnTime = 120;
        this.spawnTimer = 0;

        this.minRadius = 8;

        this.InitialGenerate(3);
    }

    InitialGenerate(numberOfPatches)
    {
        let radiusDiff =  (this.gameWorld.maxDistance - this.minRadius) / numberOfPatches;

        let radius = this.minRadius;

        for(let i = 0; i < numberOfPatches; i ++)
        {
            this.GenerateFlowerPatch(radius);

            radius += this.minRadius;
        }
    }

    GenerateFlowerPatch(radius)
    {
        let pos = this.GetRandomPositionWithRadius(radius);

        let newPatch = new FlowerPatch(pos);
        this.patches.push(newPatch);
    }

    GenerateFlowerPatchOffscreen()
    {
        let pos = this.GetOffscreenPosition();

        let newPatch = new FlowerPatch(pos);
        this.patches.push(newPatch);
    }

    GenerateFlowerPatchOnScreen()
    {
        let screenBounds = this.gameWorld.GetScreenBounds();

        let pos = {
            x: screenBounds.minX + (screenBounds.maxX - screenBounds.minX) * Math.random(),
            y: screenBounds.minY + (screenBounds.maxY - screenBounds.minY) * Math.random()
        };

        let newPatch = new FlowerPatch(pos);
        this.patches.push(newPatch);
    }

    Update(deltaTime)
    {
        this.spawnTimer += deltaTime;

        if(this.spawnTimer >= this.spawnTime)
        {
            this.spawnTimer -= this.spawnTime;

            this.GenerateFlowerPatchOffscreen();
        }
    }
}

