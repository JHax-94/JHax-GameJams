import { COLLISION_GROUP, EM } from "../main";

export default class TriggerZone
{
    constructor(tileDimensions, parent)
    {
        let physSettings = {
            tileTransform: { x: tileDimensions.x, y: tileDimensions.y, w: tileDimensions.w, h: tileDimensions.h },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: true,
            tag: "TRIGGER_ZONE",
            collisionGroup: COLLISION_GROUP.ELEVATOR,
            collisionMask: (COLLISION_GROUP.PLAYER | COLLISION_GROUP.NPC),
            material: "playerMaterial",
        };

        this.trackedObjects = [];

        this.parent = parent;

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    Update(deltaTime)
    {
        if(this.parent)
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