import { CLOSED, consoleLog, em, OPENED, PIXEL_SCALE } from "./main";

export default class Container
{
    constructor(position, sprite)
    {
        this._CLOSED = CLOSED;
        this._OPENED = OPENED;

        this.spriteIndex = sprite;

        this.initialTilePos = position;

        consoleLog("Construct tile container at ");
        consoleLog(position);

        var phys = {
            tileTransform: { 
                x: position.x,
                y: position.y,
                w: 1,
                h: 1
            },
            isSensor: true,
            isKinematic: true,
            tag: "CONTAINER",
            mass: 1
        };

        this.state = this._CLOSED;

        em.AddPhys(this, phys);
        em.AddRender(this);
    }

    GetSpawnPosition()
    {
        var screenPos = em.GetPosition(this);

        //var spawnPos = { x: screenPos.x, y: screenPos.y - PIXEL_SCALE };

        var spawnPos = {x: this.initialTilePos.x, y: this.initialTilePos.y - 1};

        consoleLog("CONTAINER POS");
        consoleLog(screenPos);

        consoleLog("SPAWN POS");
        consoleLog(spawnPos);

        return spawnPos;
    }

    CanInteract()
    {
        return this.state === this._CLOSED;
    }

    Draw()
    {
        //consoleLog("GET CONTAINER POS");
        var position = em.GetPosition(this);
        /*
        consoleLog(this.phys.position);
        consoleLog(position);*/
        /*
        consoleLog(this);
        consoleLog(position);
        */
        sprite(this.spriteIndex, position.x, position.y);
    }

}