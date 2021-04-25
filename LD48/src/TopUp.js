import Collectable from "./Collectable";
import { TOP_UP_SPRITE } from "./main";

export default class TopUp extends Collectable
{
    constructor(spawnPos)
    {
        var phys = { isKinematic: true };

        super(spawnPos, phys)

        this.spriteIndex = TOP_UP_SPRITE;
    }

    InternalCollect(diver)
    {
        diver.AddOxygenTopUp();
    }   
}