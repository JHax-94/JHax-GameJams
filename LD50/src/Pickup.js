import { consoleLog, EM } from "./main";

export default class Pickup
{
    constructor(position, spriteIndex, spawner)
    {
        this.spriteIndex = spriteIndex;

        this.spawner = spawner;

        EM.RegisterEntity(
            this, 
            {
                physSettings: 
                {
                    tileTransform: {
                        x: position.x,
                        y: position.y,
                        w: 1,
                        h: 1
                    },
                    isSensor: true,
                    isKinematic: true,
                    mass: 10,
                    tag: "PICKUP"
                }
            });

        consoleLog("SPAWNED PICKUP");
        consoleLog(this);
    }

    Collected(player)
    {
        this.ActivatePickup(player);
        this.spawner.PickupCollected();

        EM.RemoveEntity(this);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        
        sprite(this.spriteIndex, screenPos.x, screenPos.y);
    }
    
}