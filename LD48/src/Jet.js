import Collectable from "./Collectable";
import { em, JET_SPRITE } from "./main";

export default class Jet extends Collectable
{
    constructor(spawnPosition, container)
    {
        var phys = {
            isKinematic: true,
        };
        super(spawnPosition, phys, container);

        this.spriteIndex = JET_SPRITE;
    }

    InternalCollect(diver)
    {
        diver.AddJet();
    }
}