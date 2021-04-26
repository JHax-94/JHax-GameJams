import Collectable from "./Collectable";

export default class TreasureMap extends Collectable
{
    constructor(spawnPos, mapInfo, container)
    {
        var physParams = { isKinematic: true };
        super(spawnPos, physParams, container);

        this.mapInfo = mapInfo;
        this.spriteIndex = 110;
    }

    InternalCollect(diver)
    {
        diver.maps.push(this.mapInfo);
    }
}