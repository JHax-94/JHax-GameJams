import { CLOSED, consoleLog, DOOR_REPLACE_MAP, em, OPENED, PIXEL_SCALE } from './main.js';
import LockedDoorZone from './LockedDoorZone.js';

export default class LockedDoor
{
    constructor(spawnPos, tileMap, doorType)
    {
        this.tileMap = tileMap;
        var doorOffset = { 
            x: -1,
            y: -1
        }



        this.doorType = doorType;

        var phys = {
            tileTransform: { x: spawnPos.x+doorOffset.x, y: spawnPos.y+doorOffset.y, w: 2, h: 3 },
            isKinematic: true,
            tag: "DOOR",
            mass: 0
        };

        this.initialTilePos = spawnPos;

        this.state = CLOSED;

        this.doorZone = new LockedDoorZone(spawnPos, this);

        em.AddPhys(this, phys);
        em.AddRender(this);
    }

    RemoveDoorTiles()
    {
        for(var x = -1; x <= 0; x ++)
        {
            for(var y = -1; y <= 1; y ++)
            {
                var tile = {x: this.initialTilePos.mapX + x, y: this.initialTilePos.mapY + y };

                this.tileMap.remove(tile.x, tile.y);

                if(y == 1)
                {
                    //consoleLog("REPLACE TILE!");

                    var detectedTile = this.tileMap.get(tile.x, tile.y+1);
                    /*
                    consoleLog("DETECTED TILE: ");
                    consoleLog(detectedTile);
                    */
                    if(detectedTile)
                    {
                        for(var i = 0; i < DOOR_REPLACE_MAP.length; i ++)
                        {
                            var replace = DOOR_REPLACE_MAP[i];
                            /*
                            consoleLog("REPLACE MAP");
                            consoleLog(replace);
                            */
                            if(detectedTile.sprite === replace.detect)
                            {
                                var newSprite = replace.replace;

                                if(replace.replaceFlipped && detectedTile.flipH)
                                {   
                                    newSprite = replace.replaceFlipped;
                                }
                                /*
                                consoleLog("NEW SPRITE: " + newSprite);
                                */
                                this.tileMap.set(tile.x, tile.y, newSprite, false, false, false);

                                break;
                            }
                        }


                    }
                }
            }
        }

        
    }

    SetState(state)
    {
        if(this.state === CLOSED && state === OPENED)
        {
            this.doorZone.Delete();
        }
    }

    Delete()
    {
        this.state = OPENED;
        this.RemoveDoorTiles();
        em.RemoveRender(this);
        em.RemovePhys(this);
    }

    Draw()
    {

    }
} 