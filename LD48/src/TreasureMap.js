import Collectable from "./Collectable";

export default class TreasureMap extends Collectable
{
    constructor(spawnPos, mapInfo)
    {
        var physParams = { isKinematic: true };
        super(spawnPos, physParams);

        this.mapInfo = mapInfo;
        this.spriteIndex = 110;
    }

    InternalCollect(diver)
    {
        diver.maps.push(this.mapInfo);
    }
}