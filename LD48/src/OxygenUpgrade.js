import Collectable from "./Collectable";
import { em } from './main.js'; 

export default class OxygenUpgrade extends Collectable
{
    constructor(spawnPosition)
    {
        var physParams = {
            isKinematic: true
        };

        super(spawnPosition, physParams);

        this.spriteIndex = 142;
    }

    InternalCollect(diver)
    {
        diver.AddMaxOxygen(10);
    }
}