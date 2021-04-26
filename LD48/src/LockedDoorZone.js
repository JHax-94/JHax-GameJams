import { em } from "./main";

export default class LockedDoorZone
{
    constructor(spawnPos, door)
    {
        this.door = door;

        var doorOffset = { x: -2, y: -1 };

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
            diver.UseKey(this.door.doorType);
            this.Delete();
        }
    }

    Draw()
    {

    }
}