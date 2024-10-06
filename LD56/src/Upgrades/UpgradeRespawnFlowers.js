import Upgrade from "./Upgrade";

export default class UpgradeRespawnFlowers extends Upgrade
{
    constructor()
    {
        super("Populate all flowers");        
    }

    ApplyUpgrade()
    {
        let flowerSpawner = this.GameWorld().flowerSpawner;

        for(let i = 0; i < flowerSpawner.patches.length; i ++)
        {
            let patch = flowerSpawner.patches[i];

            if(patch.bugs.length < patch.maxBugs)
            {
                patch.SpawnBug();
            }
        }
    }
}