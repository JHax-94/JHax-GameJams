import { consoleLog, EM, SFX } from "./main";

export default class Pickup
{
    constructor(position, spriteIndex, spawner, powerUpName)
    {
        this.spriteIndex = spriteIndex;

        this.powerUpName = powerUpName;

        this.spawner = spawner;

        this.collectSfx = SFX.collect;

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

        /*
        consoleLog("SPAWNED PICKUP");
        consoleLog(this);*/
    }

    Collected(player)
    {
        this.ActivatePickup(player);
        this.spawner.PickupCollected();

        this.CollectedSfx();

        EM.RemoveEntity(this);
    }

    CollectedSfx()
    {
        consoleLog("COLLECT SFX");
        consoleLog(this.collectSfx);
        sfx(this.collectSfx);
    }

    ActivatePickup(player)
    {
        player.AddPowerUp(this.powerUpName);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        
        sprite(this.spriteIndex, screenPos.x, screenPos.y);
    }
}