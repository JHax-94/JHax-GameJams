import Upgrade from "./Upgrade";

export default class UpgradeSpawnFlower extends Upgrade
{
    constructor()
    {
        super("Spawn flower");
    }

    ApplyUpgrade()
    {
        let flowerSpawner = this.GameWorld().flowerSpawner;

        flowerSpawner.GenerateFlowerPatchOnScreen();
    }
}