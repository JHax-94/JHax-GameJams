import { EM, getObjectConfig } from "../main";
import Missile from "../Missile";
import Pickup from "../Pickup";

export default class ExtraMissilePickup extends Pickup
{
    constructor(position, pickupData, spawner)
    {
        super(position, pickupData.spriteIndex, spawner);
    }

    ActivatePickup(player)
    {
        let missileList = EM.GetEntitiesStartingWith("Missile_");

        let missileConf = getObjectConfig("Missile");

        EM.AddEntity(`Missile_${missileList.length}`, new Missile({ x: 3, y: 10 }, missileConf));
    }
}