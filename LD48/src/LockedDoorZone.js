import { em, RED_LOCK_SPRITE, PURPLE_LOCK_SPRITE, GREEN_LOCK_SPRITE, SFX } from "./main";

export default class LockedDoorZone
{
    constructor(spawnPos, door)
    {
        this.door = door;

        var doorOffset = { x: -2, y: -1 };

        this.lockSprite = RED_LOCK_SPRITE;

        if(this.door.doorType === "PURPLE")
        {
            this.lockSprite = PURPLE_LOCK_SPRITE;
        }
        else if(this.door.doorType === "GREEN")
        {
            this.lockSprite = GREEN_LOCK_SPRITE;
        }

        this.sfx = SFX.open;

        var phys = {
            tileTransform: { x: spawnPos.x+doorOffset.x, y: spawnPos.y+doorOffset.y, w: 4, h: 3 },
            isSensor: true,
            isKinematic: true,
            tag: "DOORZONE",
            mass: 0
        };

        em.AddPhys(this, phys);
        em.AddRender(this);
    }

    Delete()
    {
        em.RemoveRender(this);
        em.RemovePhys(this);
        this.door.Delete();
    }

    CanInteract()
    {
        return true;
    }

    Interact(diver)
    {
        if(diver.HasKey(this.door.doorType))
        {
            if(this.sfx)
            {
                sfx(this.sfx);
            }
            //diver.UseKey(this.door.doorType);
            this.Delete();
        }
        else
        {
            diver.Bloop(this.lockSprite);
        }
    }

    Draw()
    {

    }
}