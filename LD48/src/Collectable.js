import { consoleLog, em, PIXEL_SCALE, SFX } from "./main";

export default class Collectable 
{
    constructor(spawnPosition, physParams, container)
    {

        this.sfx = SFX.treasureGet;
        //consoleLog("CONSTRUCT COLLECTABLE AT POSITION");
        //consoleLog(spawnPosition);
        var phys = {
            //transform: { x: spawnPosition.x, y: spawnPosition.y, w: PIXEL_SCALE, h: PIXEL_SCALE},
            tileTransform: { x: spawnPosition.x, y: spawnPosition.y, w: 1, h: 1 },
            isSensor: true,
            tag: "COLLECTABLE",
            mass: 0
        };

        this.container = container;

        this.bloops = true;

        this.spriteIndex = 11;

        this.bloopSprite = null;

        this.collectDelay = 0.35;

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

        //consoleLog("Constructed collectable!");
        //consoleLog(this);

        this.diver = null;
    }

    PlaySoundEffect()
    {
        sfx(this.sfx);
    }

    InternalCollect(diver) { consoleLog("COLLECTABLE SUPER INTERNAL"); }

    Collect(diver)
    {
        this.InternalCollect(diver);
        if(this.bloops) diver.Bloop(this.bloopSprite ? this.bloopSprite : this.spriteIndex);

        if(this.sfx)
        {
            this.PlaySoundEffect();
        }

        if(this.container)
        {
            this.container.contentsCollected = true;
        }

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
        sprite(this.spriteIndex, position.x, position.y);
    }
}