import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_UTILS } from "../main";
import TriggerZone from "../PhysObjects/TriggerZone";
import { vec2 } from "p2";

export default class Elevator 
{
    constructor(tiles, objDef)
    {
        this.dims = TILE_UTILS.GetBlockDimensions(tiles);
        this.texture = this.BuildTextureFromTiles(tiles);

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
        this.speed = 30;
    }

    BuildTextureFromTiles(tiles)
    {
        let texture = new Texture(this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
        
        for(let i = 0; i < tiles.length; i ++)
        {
            let tile = tiles[i];

            let tSprite = {
                i: tile.sprite,
                x: tile.x - this.dims.x,
                y: tile.y - this.dims.y,
                flipH: tile.flipH,
                flipV: tile.flipV,
                flipR: tile.flipR
            };

            texture.sprite(tSprite.i, tSprite.x * PIXEL_SCALE, tSprite.y * PIXEL_SCALE, tSprite.flipH, tSprite.flipV, tSprite.flipR);
        }
        /*
        paper(9)
        texture.rectf(0, 0, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
*/
        return texture;
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
        return [ this.phys.position[0] + PIXEL_SCALE, this.phys.position[1] + PIXEL_SCALE ];
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
    }
}