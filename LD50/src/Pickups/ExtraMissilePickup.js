import { EM } from "../main";
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

        let missileConf = null;

        let objectMap = assets.objectConfig.objectMap;

        for(let i = 0; i < objectMap.length; i ++)
        {
            if(objectMap[i].name === "Missile")
            {
                missileConf = objectMap[i];
                break;
            }
        }
        
        EM.AddEntity(`Missile_${missileList.length}`, new Missile({ x: 3, y: 10 }, missileConf));
    }
}