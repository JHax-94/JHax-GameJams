import { vec2 } from "p2";
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH } from "../main"
import TimeStepper from "../TimeStepper";
import TinyCreature from "./TinyCreature";

export default class PlayerSwarm
{
    constructor(pos)
    {
        this.speed = 3*PIXEL_SCALE;

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: 1, h: 1 },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: false,
            tag: "PLAYER",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.STRUCTURE,
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.PLAYER | COLLISION_GROUP.ENEMY),
            linearDrag: 0.99
        };

        this.bugSpawnTime = 60;
        this.bugSpawnTimer = 0;
        this.maxBugs = 1;
        
        this.bugs = [];

        EM.RegisterEntity(this, { physSettings: physSettings });

        this.SpawnBug();
    }

    SpawnBug()
    {
        let tilePos = this.GetTilePos();

        let newBug = new TinyCreature(
            tilePos, 
            this, 
            {
                tag: "PLAYER_BUG", 
                collisionGroup: COLLISION_GROUP.PLAYER, 
                collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.ENEMY) 
            });

        this.bugs.push(newBug);
    }

    Input(input)
    {
        let inputVector = { x: 0, y: 0 };

        if(input.right)
        {
            inputVector.x = 1;
        }
        else if(input.left)
        {
            inputVector.x = -1;
        }
        else
        {
            inputVector.x = 0;
        }

        if(input.up)
        {
            inputVector.y = 1;            
        }
        else if(input.down)
        {
            inputVector.y = -1;
        }
        else
        {
            inputVector.y = 0;
        }

        let moveVec = [0,0];
        vec2.normalize(moveVec, [inputVector.x, inputVector.y]);

        this.phys.velocity = [moveVec[0] * this.speed, moveVec[1] * this.speed];
    }

    Update(deltaTime)
    {
        let physPos = this.phys.position;

        let hWidth = 0.5 * TILE_WIDTH * PIXEL_SCALE;
        let hHeight = 0.5 * TILE_HEIGHT * PIXEL_SCALE;

        EM.camera.MoveTo(physPos[0]-hWidth, physPos[1]+hHeight);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        
        EM.hudLog.push(`Player: (${screenPos.x}, ${screenPos.y}`);
        paper(6);
        rectf(screenPos.x, screenPos.y, PIXEL_SCALE, PIXEL_SCALE);
    }
}