import { consoleLog, em } from "./main";

export default class Collectable 
{
    constructor(spawnPosition, physParams)
    {
        var phys = {
            tileTransform: { x: spawnPosition.x, y: spawnPosition.y, w: 1, h: 1},
            isSensor: true,
            tag: "COLLECTABLE",
            mass: 0
        };

        if(physParams)
        {
            if(physParams.isKinematic)
            {
                phys.isKinematic = physParams.isKinematic
            }
        }
        
        this.removeOnCollect = true;

        em.AddPhys(this, phys);
        em.AddRender(this);

        consoleLog("Constructed collectable!");
        consoleLog(this);
    }

    InternalCollect(diver) { }

    CollectedBy(diver)
    {
        this.InternalCollect(diver);

        if(this.removeOnCollect)
        {
            em.RemovePhys(this);
            em.RemoveRender(this);
        }
    }
}