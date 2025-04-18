import { COLLISION_GROUP, EM, PIXEL_SCALE, SETUP, consoleLog } from "../main";
import LevelDoorLabel from "./LevelDoorLabel";

export default class LevelDoor
{
    constructor(tile, objDef, opts)
    {   
        consoleLog("Build level door at tile:");
        consoleLog(tile);
        consoleLog(opts);

        this.hidden = false;

        if(opts && opts.hidden)
        {
            this.hidden = true;
        }

        this.target = opts ? opts.target : null;
        this.display = opts ? opts.display : null;
        this.longTitle = opts ? opts.longTitle : null;

        this.sprite = tile.sprite;

        let physSettings = {
            tileTransform: { x: tile.x, y: tile.y, w: 1, h: 1 },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: true,
            tag: "DOOR",
            collisionGroup: COLLISION_GROUP.ELEVATOR,
            collisionMask: (COLLISION_GROUP.PLAYER),
            material: "playerMaterial",
        };

        EM.RegisterEntity(this, { physSettings: physSettings });

        if(this.display)
        {
            this.label = new LevelDoorLabel(this, opts);
        }
    }

    Show()
    {
        consoleLog("SHOWING DOOR!");

        this.hidden = false;
    }

    EnterDoor()
    {
        if(!this.hidden)
        {
            if(this.target)
            {
                SETUP(this.target);
            }
        }
    }

    Draw()
    {
        if(!this.hidden)
        {
            let screenPos = this.GetScreenPos();

            sprite(this.sprite, screenPos.x, screenPos.y);
        }
    }
}