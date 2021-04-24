import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class Collectable 
{
    constructor(spawnPosition, physParams)
    {
        consoleLog("CONSTRUCT COLLECTABLE AT POSITION");
        consoleLog(spawnPosition);
        var phys = {
            transform: { x: spawnPosition.x, y: spawnPosition.y, w: PIXEL_SCALE, h: PIXEL_SCALE},
            isSensor: true,
            tag: "COLLECTABLE",
            mass: 0
        };

        this.spriteIndex = 11;

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

    Draw()
    {
        var position = em.GetPosition(this);
        sprite(this.spriteIndex, position.x, position.y);
    }
}