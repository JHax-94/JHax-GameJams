import Upgrade from "./Upgrade";

export default class UpgradeSpawnHive extends Upgrade
{
    constructor()
    {
        super("Spawn Hive");
    }

    ApplyUpgrade()
    {
        this.GameWorld().SpawnExtraHive();
    }



}