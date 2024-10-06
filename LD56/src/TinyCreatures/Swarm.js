import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE } from "../main";
import Scout from "./Scout";

export default class Swarm
{
    constructor(pos, physConf)
    {
        this.gameWorld = null;
        this.bugs = [];
        this.bugType = {
            colors: [9, 10],
            tag: "PLAYER_BUG",
            perceptionTag: "PLAYER_PERCEPTION",
            perceptionMask: COLLISION_GROUP.ENEMY
        };

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: 1, h: 1 },
            mass: 100,
            isSensor: true,
            freeRotate: true,
            isKinematic: false,
            tag: physConf.tag,
            material: "playerMaterial",
            collisionGroup: physConf.collisionGroup,
            collisionMask: physConf.collisionMask,
            linearDrag: 0.99
        };

        this.speed = 2*PIXEL_SCALE;

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    Refresh()
    {

    }

    GameWorld()
    {
        if(this.gameWorld === null)
        {
            this.gameWorld = EM.GetEntity("GAMEWORLD");
        }

        return this.gameWorld;
    }

    RemoveBug(bug)
    {
        /*consoleLog("Remove bug:");
        consoleLog(bug);
        consoleLog("From list:");
        consoleLog(this.bugs);*/
        for(let i = 0; i < this.bugs.length; i ++)
        {
            if(this.bugs[i] === bug)
            {
                this.bugs.splice(i,1);
                break;
            }
        }
    }

    AddBug(bug)
    {
        if(this.bugs.indexOf(bug) < 0)
        {
            this.bugs.push(bug);
        }
    }

    IsHunting(sourceBug, targetBug)
    {
        let isHunting = false;

        for(let i = 0; i < this.bugs.length; i ++)
        {
            if(this.bugs[i] !== sourceBug && this.bugs[i].prey === targetBug)
            {
                isHunting = true;
                break;
            }
        }

        return isHunting;
    }

    ConvertBug(bug)
    {
        let tilePos = bug.GetTilePos();
        bug.Despawn(true);

        this.SpawnBug(tilePos);
    }

    SpawnBug(tilePos = null)
    {
        if(tilePos === null)
        {
            tilePos = this.GetTilePos();

            let xOffset = -1 + (Math.random() * 2);
            let yOffset = -1 + (Math.random() * 2);

            tilePos.x += xOffset;
            tilePos.y += yOffset;
        }
        let newBug = new Scout(tilePos, this);


        /*consoleLog("===== BUG SPAWNED ======");
        consoleLog(newBug);*/

        this.bugs.push(newBug);
    }
    /*
    Draw()
    {
        let screenPos = this.GetScreenPos();

        paper(6);
        rectf(screenPos.x, screenPos.y, PIXEL_SCALE, PIXEL_SCALE);
    }*/
}