import { consoleLog, em } from "./main";

export default class Container
{
    constructor(position, sprite)
    {
        this.spriteIndex = sprite;

        consoleLog("Construct tile container at ");
        consoleLog(position);

        consoleLog()

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
        }

        em.AddPhys(this, phys);
        em.AddRender(this);
    }

    Draw()
    {
        consoleLog("GET CONTAINER POS");
        var position = em.GetPosition(this);

        consoleLog(this.phys.position);
        consoleLog(position);
        /*
        consoleLog(this);
        consoleLog(position);
        */
        sprite(this.spriteIndex, position.x, position.y);
    }

}