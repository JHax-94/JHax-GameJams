import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_UTILS, consoleLog } from "../main";
import TriggerZone from "../PhysObjects/TriggerZone";
import { vec2 } from "p2";

export default class Elevator 
{
    constructor(tiles, objDef)
    {
        this.hideCollider = true;
        
        this.srcTiles = tiles;
        
        this.dims = TILE_UTILS.GetBlockDimensions(tiles);
        this.texture = TILE_UTILS.BuildTextureFromTiles(tiles, this.dims);

        let physSettings = {
            tileTransform: { x: this.dims.x, y: this.dims.y, w: this.dims.w, h: this.dims.h },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: "ELEVATOR",
            collisionGroup: COLLISION_GROUP.ELEVATOR,
            collisionMask: (COLLISION_GROUP.PLAYER | COLLISION_GROUP.NPC),
            material: "playerMaterial",
        };

        EM.RegisterEntity(this, { physSettings: physSettings });

        this.triggerZone = new TriggerZone({
            x: this.dims.x - 1,
            y: this.dims.y,
            w: this.dims.w + 1,
            h: this.dims.h
        },
        this);

        this.Setup();
    }

    Setup()
    {
        this.elevatorBounds = null;
        this.speed = 30;
    }

    StopsAtFloor(floorNumber)
    {
        return !!this.GetSummonerOnFloor(floorNumber);
    }

    GetSummonerOnFloor(floorNumber)
    {
        let summoner = null;

        if(this.elevatorBounds)
        {
            let summoners = this.elevatorBounds.summoners;

            for(let i = 0; i < summoners.length; i ++)
            {
                if(summoners[i].FloorNumber() === floorNumber)
                {
                    summoner = summoners[i];
                    break;
                }
            }
        }
        else
        {
            console.error(`Unable to check stops for elevator without bounds`);
            consoleLog(this);
        }

        return summoner;
    }

    AddBounds(bounds)
    {
        this.elevatorBounds = bounds;
        bounds.elevator = this;
    }

    IsMoving()
    {
        return vec2.sqrLen(this.phys.velocity) > 0;
    }

    MoveUp()
    {
        this.phys.velocity = [ this.phys.velocity[0], this.speed ];
    }

    MoveDown()
    {
        this.phys.velocity = [this.phys.velocity[0], -this.speed];
    }

    Stop()
    {
        this.phys.velocity = [0, 0];
    }

    GetDisembarkPosition()
    {
        return [ this.phys.position[0] + PIXEL_SCALE, this.phys.position[1] ];
    }

    ObjectEntered(newObject, fromZone)
    {
        if(newObject.tag === "PLAYER")
        {
            let player = newObject.obj;

            player.SetElevator(this);
        }
    }

    ObjectExited(oldObject, fromZone)
    {
        if(oldObject.tag === "PLAYER")
        {
            let player = oldObject.obj;

            player.RemoveElevator(this);
        }
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        this.texture._drawEnhanced(screenPos.x, screenPos.y);

        let disembark = this.GetDisembarkPosition();
        let screenDisembark = EM.PhysToScreenPos(disembark);

        paper(9);
        rectf(screenDisembark.x, screenDisembark.y, PIXEL_SCALE, PIXEL_SCALE);
    }
}