import Upgrade from "./Upgrade";

export default class UpgradeRoyalJelly extends Upgrade
{
    constructor()
    {
        super("Spawn Royal Jelly");
    }

    ApplyUpgrade()
    {
        let jellySpawner = this.GameWorld().royalJellySpawner;

        jellySpawner.SpawnRoyalJellyOnScreen();
    }
}