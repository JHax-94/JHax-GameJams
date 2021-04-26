import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class Collectable 
{
    constructor(spawnPosition, physParams)
    {
        consoleLog("CONSTRUCT COLLECTABLE AT POSITION");
        consoleLog(spawnPosition);
        var phys = {
            //transform: { x: spawnPosition.x, y: spawnPosition.y, w: PIXEL_SCALE, h: PIXEL_SCALE},
            tileTransform: { x: spawnPosition.x+0.25, y: spawnPosition.y+0.25, w: 0.5, h: 0.5 },
            isSensor: true,
            tag: "COLLECTABLE",
            mass: 0
        };

        this.bloops = true;

        this.spriteIndex = 11;

        this.collectDelay = 0.5;

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
        em.AddUpdate(this);

        consoleLog("Constructed collectable!");
        consoleLog(this);

        this.diver = null;
    }

    InternalCollect(diver) { consoleLog("COLLECTABLE SUPER INTERNAL"); }

    Collect(diver)
    {
        this.InternalCollect(diver);
        if(this.bloops) this.diver.Bloop(this.spriteIndex);

        if(this.removeOnCollect)
        {
            this.Delete();    
        }
    }

    CanCollect()
    {
        return !(this.collectDelay > 0);
    }

    Update(deltaTime)
    {
        if(this.collectDelay > 0)
        {
            this.collectDelay -= deltaTime;
            if(this.collectDelay <= 0)
            {
                this.collectDelay = 0;

                if(this.diver)
                {
                    this.Collect(this.diver);
                }
            }
        }
    }

    Delete()
    {
        consoleLog("DELETING COLLECTABLE...");
        consoleLog(this);
        em.RemoveUpdate(this);
        em.RemovePhys(this);
        em.RemoveRender(this);
    }

    RemoveDiver()
    {
        this.diver = null;
    }

    CollectedBy(diver)
    {
        if(this.CanCollect())
        {
            this.Collect(diver);
        }
        else
        {
            consoleLog("TRACK DIVER FOR LATER...");
            this.diver = diver;
        }
    }

    Draw()
    {
        var position = em.GetPosition(this);
        sprite(this.spriteIndex, position.x-0.25*PIXEL_SCALE, position.y-0.25*PIXEL_SCALE);
    }
}