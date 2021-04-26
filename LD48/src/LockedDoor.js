import { CLOSED, em, OPENED, PIXEL_SCALE } from './main.js';
import LockedDoorZone from './LockedDoorZone.js';

export default class LockedDoor
{
    constructor(spawnPos, spriteList, doorType)
    {
        var doorOffset = { 
            x: -1,
            y: -1
        }

        this.doorType = doorType;

        var phys = {
            tileTransform: { x: spawnPos.x+doorOffset.x, y: spawnPos.y+doorOffset.y, w: 2, h: 3 },
            isKinematic: true,
            tag: "DOOR",
            mass: 0
        };

        this.initialTilePos = spawnPos;

        this.state = CLOSED;

        this.doorZone = new LockedDoorZone(spawnPos, this);

        em.AddPhys(this, phys);
        em.AddRender(this);
    }

    SetState(state)
    {
        if(this.state === CLOSED && state === OPENED)
        {
            this.doorZone.Delete();
        }
    }

    Delete()
    {
        this.state = OPENED;
        em.RemoveRender(this);
        em.RemovePhys(this);
    }

    Draw()
    {

    }
} 