import { COLLISION_GROUP, EM, consoleLog } from "../main";

export default class TriggerZone
{
    constructor(tileDimensions, parent, settings)
    {
        consoleLog("Building trigger zone with settings");

        this.hideCollider = false;

        if(settings && settings.hideCollider)
        {
            this.hideCollider = true;
        }

        let physSettings = {
            tileTransform: { x: tileDimensions.x, y: tileDimensions.y, w: tileDimensions.w, h: tileDimensions.h },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: true,
            tag: (settings && settings.tag) ? settings.tag : "TRIGGER_ZONE",
            collisionGroup: (settings && settings.collisionGroup) ? settings.collisionGroup : COLLISION_GROUP.ELEVATOR,
            collisionMask: (settings && settings.collisionMask) ? settings.collisionMask : (COLLISION_GROUP.PLAYER | COLLISION_GROUP.NPC),
            material: "playerMaterial",
        };

        this.trackedObjects = [];

        this.lockToParent = (settings && settings.lockToParent) ? true : false;
        this.parent = parent;

        consoleLog("Register trigger zone with phys settings:");        
        consoleLog(physSettings);

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    MoveToTilePos(tilePosition)
    {
        consoleLog(`Move to tile position: (${tilePosition.x}, ${tilePosition.y})`);

        let physPos = EM.TileToPhysPosition(tilePosition);

        this.phys.position = [physPos[0], physPos[1]];
    }

    Update(deltaTime)
    {
        if(this.parent && this.lockToParent)
        {
            this.phys.position = [ this.parent.phys.position[0], this.parent.phys.position[1] ];
        }
    }

    ObjectEntered(obj)
    {
        if(this.trackedObjects.findIndex(to => to === obj) < 0)
        {
            this.trackedObjects.push(obj);

            if(this.parent && this.parent.ObjectEntered)
            {
                this.parent.ObjectEntered(obj, this);
            }
        }
    }

    LogState(zoneName)
    {
        EM.hudLog.push(`${zoneName}: ${this.trackedObjects.length}`);
    }

    ObjectExited(obj)
    {
        let index = this.trackedObjects.findIndex(to => to === obj);

        if(index >= 0)
        {
            this.trackedObjects.splice(index, 1);

            if(this.parent && this.parent.ObjectExited)
            {
                this.parent.ObjectExited(obj, this);
            }
        }
    }

    Draw() 
    { 
        // Need the draw function to debug colliders
    }


}