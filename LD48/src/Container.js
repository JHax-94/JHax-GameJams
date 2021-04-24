import { em } from "./main";

export default class Container
{
    constructor(position, sprite)
    {
        this.spriteIndex = sprite;

        var phys = {
            tileTransform: { 
                x: position.x,
                y: position.y,
                w: 1,
                h: 1
            },
            isSensor: true,
            isKinematic: true,
            tag: "CONTAINER"
        }

        em.AddPhys(this, phys);
        em.AddRender(this);
    }

    Draw()
    {
        //consoleLog("DRAW CONTAINER");
        var position = em.GetPosition(this);
        /*
        consoleLog(this);
        consoleLog(position);
        */
        sprite(this.spriteIndex, position.x, position.y);
    }

}